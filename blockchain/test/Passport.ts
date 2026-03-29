import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { keccak256, stringToHex } from "viem";
import { network } from "hardhat";

describe("Passport suite", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, creator, holder, issuer, revoker] = await viem.getWalletClients();

  async function deploySuite(options?: { withRegistry?: boolean }) {
    const assetPassport = await viem.deployContract("AssetPassport", [
      owner.account.address,
      "DeProof Asset Passport",
      "DPAP",
    ]);
    const passportAuthority = await viem.deployContract("PassportAuthority", [owner.account.address]);
    const chronicleStamp = await viem.deployContract("ChronicleStamp", [owner.account.address]);
    const passportFactory = await viem.deployContract("PassportFactory", [owner.account.address]);

    await publicClient.waitForTransactionReceipt({
      hash: await assetPassport.write.setAuthority([passportAuthority.address]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await assetPassport.write.setChronicle([chronicleStamp.address]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await assetPassport.write.setFactory([passportFactory.address, true]),
    });

    await publicClient.waitForTransactionReceipt({
      hash: await passportAuthority.write.setAssetPassport([assetPassport.address]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await passportAuthority.write.setChronicle([chronicleStamp.address]),
    });

    await publicClient.waitForTransactionReceipt({
      hash: await chronicleStamp.write.setAssetPassport([assetPassport.address]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await chronicleStamp.write.setAuthority([passportAuthority.address]),
    });

    await publicClient.waitForTransactionReceipt({
      hash: await passportFactory.write.setAssetPassport([assetPassport.address]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await passportFactory.write.setAuthority([passportAuthority.address]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await passportFactory.write.setChronicle([chronicleStamp.address]),
    });

    let registry;
    if (options?.withRegistry) {
      registry = await viem.deployContract("MockSubjectAccountRegistry");
      await publicClient.waitForTransactionReceipt({
        hash: await passportFactory.write.setSubjectAccountRegistry([registry.address]),
      });
      await publicClient.waitForTransactionReceipt({
        hash: await passportFactory.write.setSubjectAccountImplementation([owner.account.address]),
      });
    }

    return {
      assetPassport,
      passportAuthority,
      chronicleStamp,
      passportFactory,
      registry,
    };
  }

  function buildInitData(label: string) {
    return {
      assetFingerprint: keccak256(stringToHex(label)),
      passportMetadataCID: `cid-passport-${label}`,
      assetMetadataCID: `cid-asset-${label}`,
      initialHolder: holder.account.address,
    };
  }

  it("PassportFactory creates a passport and binds a subject account", async function () {
    const suite = await deploySuite({ withRegistry: true });

    await publicClient.waitForTransactionReceipt({
      hash: await suite.passportAuthority.write.setPassportCreator([creator.account.address, true]),
    });

    const initData = buildInitData("factory-create");
    const expectedSubjectAccount = await suite.passportFactory.read.previewSubjectAccount([1n]);

    const txHash = await suite.passportFactory.write.createPassport([initData], {
      account: creator.account,
    });
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    const record = await suite.assetPassport.read.recordOf([1n]);

    assert.equal(record.passportId, 1n);
    assert.equal(record.subjectAccount, expectedSubjectAccount);
    assert.equal(record.passportMetadataCID, initData.passportMetadataCID);
    assert.equal(record.assetMetadataCID, initData.assetMetadataCID);
    assert.equal(record.status, 1);
    assert.equal(
      (await suite.assetPassport.read.ownerOf([1n])).toLowerCase(),
      holder.account.address.toLowerCase(),
    );
  });

  it("PassportAuthority exposes creator, issuer and revocation permissions", async function () {
    const suite = await deploySuite();

    await publicClient.waitForTransactionReceipt({
      hash: await suite.passportAuthority.write.setPassportCreator([creator.account.address, true]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await suite.passportAuthority.write.setTypeIssuerPolicy([
        issuer.account.address,
        7n,
        {
          enabled: true,
          validAfter: 0,
          validUntil: 0,
          restrictToExplicitPassportList: false,
          policyCID: "policy://type/7",
        },
      ]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await suite.passportAuthority.write.setRevocationOperator([revoker.account.address, true]),
    });

    assert.equal(
      await suite.passportAuthority.read.canCreatePassport([creator.account.address]),
      true,
    );
    assert.equal(
      await suite.passportAuthority.read.canIssue([issuer.account.address, 7n, 99n]),
      true,
    );
    assert.equal(
      await suite.passportAuthority.read.isRevocationOperator([revoker.account.address]),
      true,
    );
  });

  it("ChronicleStamp supports singleton supersession and revoke flows", async function () {
    const suite = await deploySuite();

    await publicClient.waitForTransactionReceipt({
      hash: await suite.passportAuthority.write.setPassportCreator([creator.account.address, true]),
    });
    await publicClient.waitForTransactionReceipt({
      hash: await suite.passportAuthority.write.setTypeIssuerPolicy([
        issuer.account.address,
        9n,
        {
          enabled: true,
          validAfter: 0,
          validUntil: 0,
          restrictToExplicitPassportList: false,
          policyCID: "policy://type/9",
        },
      ]),
    });

    await publicClient.waitForTransactionReceipt({
      hash: await suite.passportFactory.write.createPassport([buildInitData("chronicle")], {
        account: creator.account,
      }),
    });

    await publicClient.waitForTransactionReceipt({
      hash: await suite.chronicleStamp.write.configureStampType([
        9n,
        {
          code: "INSPECTION",
          name: "Inspection",
          schemaCID: "schema://inspection",
          active: true,
          singleton: true,
        },
      ]),
    });

    const latestBlock = await publicClient.getBlock();
    const occurredAt = BigInt(latestBlock.timestamp);

    await publicClient.waitForTransactionReceipt({
      hash: await suite.chronicleStamp.write.issueStamp(
        [1n, 9n, Number(occurredAt), "cid://stamp/1", 0n],
        { account: issuer.account },
      ),
    });

    assert.equal(await suite.chronicleStamp.read.latestEffectiveStampId([1n, 9n]), 1n);

    await publicClient.waitForTransactionReceipt({
      hash: await suite.chronicleStamp.write.issueStamp(
        [1n, 9n, Number(occurredAt), "cid://stamp/2", 1n],
        { account: issuer.account },
      ),
    });

    const firstStamp = await suite.chronicleStamp.read.stampRecordOf([1n]);
    const secondStamp = await suite.chronicleStamp.read.stampRecordOf([2n]);

    assert.equal(firstStamp.revoked, true);
    assert.equal(firstStamp.revokedByStampId, 2n);
    assert.equal(secondStamp.supersedesStampId, 1n);
    assert.equal(secondStamp.revoked, false);
    assert.equal(await suite.chronicleStamp.read.latestEffectiveStampId([1n, 9n]), 2n);

    await publicClient.waitForTransactionReceipt({
      hash: await suite.chronicleStamp.write.revokeStamp([2n, "cid://revoke/2"], {
        account: issuer.account,
      }),
    });

    const revokedSecondStamp = await suite.chronicleStamp.read.stampRecordOf([2n]);
    assert.equal(revokedSecondStamp.revoked, true);
    assert.equal(await suite.chronicleStamp.read.latestEffectiveStampId([1n, 9n]), 0n);
  });
});
