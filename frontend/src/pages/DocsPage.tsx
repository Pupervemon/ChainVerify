import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import { usePassportLocale } from "../features/passport/i18n";
import creatorAccessDoc from "../../docs/creator-access.md?raw";
import issueStampDoc from "../../docs/issue-stamp.md?raw";
import issuerAuthorizationDoc from "../../docs/issuer-authorization.md?raw";
import overviewDoc from "../../docs/README.md?raw";
import revocationOperatorsDoc from "../../docs/revocation-operators.md?raw";
import revokeStampDoc from "../../docs/revoke-stamp.md?raw";
import stampTypeAdminDoc from "../../docs/stamp-type-admin.md?raw";
import stampTypePermissionDoc from "../../docs/stamp-type-permission.md?raw";
import trustedFactoriesDoc from "../../docs/trusted-factories.md?raw";

type DocGroupKey = "foundations" | "governance" | "operations";

type LocalizedText = {
  en: string;
  zh: string;
};

type DocEntry = {
  description: LocalizedText;
  group: DocGroupKey;
  navLabel: LocalizedText;
  slug: string;
  source: string;
  title: LocalizedText;
};

type DocGroup = {
  key: DocGroupKey;
  label: LocalizedText;
};

type HeadingBlock = {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  type: "heading";
};

type MarkdownBlock =
  | HeadingBlock
  | {
      ordered: boolean;
      items: string[];
      type: "list";
    }
  | {
      code: string;
      language: string;
      type: "code";
    }
  | {
      text: string;
      type: "paragraph";
    };

const DOC_GROUPS: DocGroup[] = [
  {
    key: "foundations",
    label: {
      zh: "基础概念",
      en: "Foundations",
    },
  },
  {
    key: "governance",
    label: {
      zh: "治理与授权",
      en: "Governance",
    },
  },
  {
    key: "operations",
    label: {
      zh: "操作流程",
      en: "Operations",
    },
  },
];

const DOC_ENTRIES: DocEntry[] = [
  {
    slug: "overview",
    title: {
      zh: "Passport 前端文档",
      en: "Passport Frontend Docs",
    },
    navLabel: {
      zh: "总览",
      en: "Overview",
    },
    description: {
      zh: "按合约职责梳理 Passport 前端页面、权限边界与配置入口。",
      en: "Contract-aligned map of the Passport frontend pages and responsibility split.",
    },
    group: "foundations",
    source: overviewDoc,
  },
  {
    slug: "trusted-factories",
    title: {
      zh: "可信工厂",
      en: "Trusted Factories",
    },
    navLabel: {
      zh: "可信工厂",
      en: "Trusted Factories",
    },
    description: {
      zh: "说明哪些工厂合约可以进入 Passport 的铸造流程。",
      en: "Which factory contracts are allowed into the Passport minting path.",
    },
    group: "foundations",
    source: trustedFactoriesDoc,
  },
  {
    slug: "creator-access",
    title: {
      zh: "创建者权限",
      en: "Creator Access",
    },
    navLabel: {
      zh: "创建权限",
      en: "Creator Access",
    },
    description: {
      zh: "说明谁可以发起 Passport 创建，以及钱包级权限如何生效。",
      en: "Wallet-level permission model for creating passports.",
    },
    group: "foundations",
    source: creatorAccessDoc,
  },
  {
    slug: "stamp-type-permission",
    title: {
      zh: "印章类型权限",
      en: "Stamp Type Permission",
    },
    navLabel: {
      zh: "类型权限",
      en: "Stamp Type Permission",
    },
    description: {
      zh: "说明按类型授予管理员权限的方式，以及这些权限具体控制什么。",
      en: "How per-type admin rights are granted and what they actually authorize.",
    },
    group: "governance",
    source: stampTypePermissionDoc,
  },
  {
    slug: "stamp-type-admin",
    title: {
      zh: "印章类型管理",
      en: "Stamp Type Admin",
    },
    navLabel: {
      zh: "类型管理",
      en: "Stamp Type Admin",
    },
    description: {
      zh: "说明印章类型定义如何在链上加载、编辑和整体覆盖。",
      en: "How a stamp type definition is loaded, edited, and fully overwritten on-chain.",
    },
    group: "governance",
    source: stampTypeAdminDoc,
  },
  {
    slug: "issuer-authorization",
    title: {
      zh: "发章授权",
      en: "Issuer Access",
    },
    navLabel: {
      zh: "发章授权",
      en: "Issuer Access",
    },
    description: {
      zh: "说明全局、按类型、按 Passport 范围的发章授权模型。",
      en: "Global, type, and passport-scoped issuance policies.",
    },
    group: "governance",
    source: issuerAuthorizationDoc,
  },
  {
    slug: "issue-stamp",
    title: {
      zh: "签发印章",
      en: "Issue Stamp",
    },
    navLabel: {
      zh: "签发印章",
      en: "Issue Stamp",
    },
    description: {
      zh: "说明签发流程、singleton 规则以及合约侧校验。",
      en: "End-to-end issuance flow, singleton rules, and contract-side checks.",
    },
    group: "operations",
    source: issueStampDoc,
  },
  {
    slug: "revocation-operators",
    title: {
      zh: "撤销操作员",
      en: "Revocation Operators",
    },
    navLabel: {
      zh: "撤销操作员",
      en: "Revocation Operators",
    },
    description: {
      zh: "说明全局撤销角色的权限边界与操作注意事项。",
      en: "Global revocation role boundaries and operational cautions.",
    },
    group: "operations",
    source: revocationOperatorsDoc,
  },
  {
    slug: "revoke-stamp",
    title: {
      zh: "撤销印章",
      en: "Revoke Stamp",
    },
    navLabel: {
      zh: "撤销印章",
      en: "Revoke Stamp",
    },
    description: {
      zh: "说明撤销流程、角色校验以及对有效印章的影响。",
      en: "Actual revoke flow, role checks, and the impact on effective stamps.",
    },
    group: "operations",
    source: revokeStampDoc,
  },
];

const DEFAULT_DOC_SLUG = "overview";
const TOP_LEVEL_DOC_SLUGS = [DEFAULT_DOC_SLUG];
const TOP_LEVEL_DOCS = DOC_ENTRIES.filter((entry) => TOP_LEVEL_DOC_SLUGS.includes(entry.slug));

const DOC_MAP = new Map(DOC_ENTRIES.map((entry) => [entry.slug, entry]));

function resolveLocalizedText(
  value: LocalizedText,
  t: (zh: string, en: string) => string,
) {
  return t(value.zh, value.en);
}

function toDocPath(slug: string) {
  return slug === DEFAULT_DOC_SLUG ? "/doc" : `/doc/${slug}`;
}

function stripMarkdownSyntax(value: string) {
  return value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

function toAnchorId(value: string) {
  return stripMarkdownSyntax(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isBlockBoundary(line: string) {
  return (
    /^#{1,6}\s+/.test(line) ||
    /^```/.test(line) ||
    /^\s*-\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line)
  );
}

function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const currentLine = lines[index];
    const trimmedLine = currentLine.trim();

    if (!trimmedLine) {
      index += 1;
      continue;
    }

    const codeFenceMatch = /^```([\w-]*)\s*$/.exec(trimmedLine);
    if (codeFenceMatch) {
      const codeLines: string[] = [];
      const language = codeFenceMatch[1] ?? "";
      index += 1;

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({
        type: "code",
        code: codeLines.join("\n"),
        language,
      });
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(trimmedLine);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const text = headingMatch[2].trim();

      blocks.push({
        type: "heading",
        level,
        text,
        id: toAnchorId(text),
      });
      index += 1;
      continue;
    }

    const unorderedListMatch = /^\s*-\s+(.*)$/.exec(currentLine);
    const orderedListMatch = /^\s*\d+\.\s+(.*)$/.exec(currentLine);
    if (unorderedListMatch || orderedListMatch) {
      const ordered = Boolean(orderedListMatch);
      const items: string[] = [];

      while (index < lines.length) {
        const listMatch = ordered
          ? /^\s*\d+\.\s+(.*)$/.exec(lines[index])
          : /^\s*-\s+(.*)$/.exec(lines[index]);

        if (!listMatch) {
          break;
        }

        items.push(listMatch[1].trim());
        index += 1;
      }

      blocks.push({
        type: "list",
        ordered,
        items,
      });
      continue;
    }

    const paragraphParts = [trimmedLine];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index];
      const trimmedNextLine = nextLine.trim();

      if (!trimmedNextLine || isBlockBoundary(nextLine)) {
        break;
      }

      paragraphParts.push(trimmedNextLine);
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphParts.join(" "),
    });
  }

  return blocks;
}

function getOutlineHeadings(blocks: MarkdownBlock[]): HeadingBlock[] {
  return blocks.filter(
    (block): block is HeadingBlock => block.type === "heading" && block.level >= 2 && block.level <= 3,
  );
}

const DOC_OUTLINE_MAP = new Map(
  DOC_ENTRIES.map((entry) => [entry.slug, getOutlineHeadings(parseMarkdown(entry.source))]),
);

function docSlugFromHref(href: string) {
  const [rawPath] = href.split("#");
  const normalizedPath = rawPath.replace(/^\.?\//, "").replace(/\.md$/i, "");

  if (!normalizedPath || normalizedPath.toLowerCase() === "readme") {
    return DEFAULT_DOC_SLUG;
  }

  return normalizedPath;
}

function renderDocLink(label: string, href: string, key: string) {
  const [rawPath, rawHash] = href.split("#");
  const hashSuffix = rawHash ? `#${rawHash}` : "";

  if (href.startsWith("#")) {
    return (
      <a key={key} href={href}>
        {label}
      </a>
    );
  }

  if (/^https?:\/\//i.test(href)) {
    return (
      <a key={key} href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }

  if (/\.md($|#)/i.test(rawPath) || rawPath.startsWith("./")) {
    const slug = docSlugFromHref(href);

    if (DOC_MAP.has(slug)) {
      return (
        <Link key={key} to={`${toDocPath(slug)}${hashSuffix}`}>
          {label}
        </Link>
      );
    }
  }

  return (
    <a key={key} href={href}>
      {label}
    </a>
  );
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const inlinePattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlinePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      nodes.push(renderDocLink(match[2], match[3], `${keyPrefix}-link-${match.index}`));
    } else if (match[4]) {
      nodes.push(
        <code key={`${keyPrefix}-code-${match.index}`} className="docs-inline-code">
          {match[4]}
        </code>,
      );
    } else if (match[5]) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${match.index}`} className="font-semibold text-slate-950">
          {match[5]}
        </strong>,
      );
    }

    lastIndex = inlinePattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function MarkdownDocument({ blocks }: { blocks: MarkdownBlock[] }) {
  return (
    <div className="docs-markdown">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 1) {
            return (
              <h1 key={`heading-${block.id}-${index}`} id={block.id}>
                {renderInlineMarkdown(block.text, `heading-${index}`)}
              </h1>
            );
          }

          if (block.level === 2) {
            return (
              <h2 key={`heading-${block.id}-${index}`} id={block.id}>
                {renderInlineMarkdown(block.text, `heading-${index}`)}
              </h2>
            );
          }

          if (block.level === 3) {
            return (
              <h3 key={`heading-${block.id}-${index}`} id={block.id}>
                {renderInlineMarkdown(block.text, `heading-${index}`)}
              </h3>
            );
          }

          if (block.level === 4) {
            return (
              <h4 key={`heading-${block.id}-${index}`} id={block.id}>
                {renderInlineMarkdown(block.text, `heading-${index}`)}
              </h4>
            );
          }

          if (block.level === 5) {
            return (
              <h5 key={`heading-${block.id}-${index}`} id={block.id}>
                {renderInlineMarkdown(block.text, `heading-${index}`)}
              </h5>
            );
          }

          return (
            <h6 key={`heading-${block.id}-${index}`} id={block.id}>
              {renderInlineMarkdown(block.text, `heading-${index}`)}
            </h6>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={`paragraph-${index}`}>
              {renderInlineMarkdown(block.text, `paragraph-${index}`)}
            </p>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";

          return (
            <ListTag key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`list-item-${index}-${itemIndex}`}>
                  {renderInlineMarkdown(item, `list-${index}-${itemIndex}`)}
                </li>
              ))}
            </ListTag>
          );
        }

        return (
          <pre key={`code-${index}`}>
            <code className={block.language ? `language-${block.language}` : undefined}>
              {block.code}
            </code>
          </pre>
        );
      })}
    </div>
  );
}

export default function DocsPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { locale, t } = usePassportLocale();
  const currentDoc = DOC_MAP.get(slug ?? DEFAULT_DOC_SLUG);
  const isOverviewDoc = currentDoc?.slug === DEFAULT_DOC_SLUG;
  const isTopLevelDoc = currentDoc ? TOP_LEVEL_DOC_SLUGS.includes(currentDoc.slug) : false;
  const currentGroup = currentDoc && !isTopLevelDoc ? currentDoc.group : null;
  const blocks = useMemo(() => parseMarkdown(currentDoc?.source ?? ""), [currentDoc?.source]);
  const articleBlocks =
    blocks[0]?.type === "heading" && blocks[0].level === 1 ? blocks.slice(1) : blocks;
  const currentOutline = currentDoc ? (DOC_OUTLINE_MAP.get(currentDoc.slug) ?? []) : [];
  const [expandedGroups, setExpandedGroups] = useState<DocGroupKey[]>(() => []);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const currentDocTitle = currentDoc ? resolveLocalizedText(currentDoc.title, t) : "";
  const currentDocNavLabel = currentDoc ? resolveLocalizedText(currentDoc.navLabel, t) : "";
  const currentDocDescription = currentDoc ? resolveLocalizedText(currentDoc.description, t) : "";

  useEffect(() => {
    if (!currentGroup) {
      return;
    }

    setExpandedGroups((previous) =>
      previous.includes(currentGroup) ? previous : [...previous, currentGroup],
    );
  }, [currentGroup]);

  useEffect(() => {
    if (!currentDoc) {
      return;
    }

    const hash = location.hash.replace(/^#/, "");

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      target?.scrollIntoView({ block: "start", behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentDoc, location.hash]);

  useEffect(() => {
    if (!currentOutline.length) {
      setActiveHeadingId("");
      return;
    }

    const updateActiveHeading = () => {
      const offset = 144;
      let nextActiveHeadingId = currentOutline[0]?.id ?? "";

      for (const heading of currentOutline) {
        const element = document.getElementById(heading.id);

        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= offset) {
          nextActiveHeadingId = heading.id;
        } else {
          break;
        }
      }

      setActiveHeadingId((previous) =>
        previous === nextActiveHeadingId ? previous : nextActiveHeadingId,
      );
    };

    const frame = window.requestAnimationFrame(updateActiveHeading);
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [currentOutline, location.hash]);

  if (!currentDoc) {
    return <Navigate to="/doc" replace />;
  }

  return (
    <div className="docs-page" data-locale={locale}>
      <div className="docs-shell">
        <section
          className={`docs-layout ${currentOutline.length > 0 ? "has-outline" : ""} ${
            isOverviewDoc ? "is-overview" : ""
          }`}
        >
          <aside className="docs-sidebar">
            <div className="docs-sidebar__frame">
              <div className="docs-sidebar__nav">
                {TOP_LEVEL_DOCS.map((entry) => {
                  const isActive = entry.slug === currentDoc.slug;

                  return (
                    <section
                      key={entry.slug}
                      className={`docs-nav-entry docs-nav-entry--top-level ${isActive ? "is-active" : ""}`}
                    >
                      <Link
                        to={toDocPath(entry.slug)}
                        className={`docs-nav-top-link ${isActive ? "is-active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="docs-nav-top-link__title">
                          {resolveLocalizedText(entry.navLabel, t)}
                        </span>
                      </Link>
                    </section>
                  );
                })}

                {DOC_GROUPS.map((group) => {
                  const groupEntries = DOC_ENTRIES.filter(
                    (entry) => entry.group === group.key && !TOP_LEVEL_DOC_SLUGS.includes(entry.slug),
                  );
                  const isOpen = expandedGroups.includes(group.key);
                  const hasActiveEntry = groupEntries.some((entry) => entry.slug === currentDoc.slug);
                  const panelId = `docs-nav-group-${group.key}`;

                  return (
                    <section
                      key={group.key}
                      className={`docs-nav-group ${isOpen ? "is-open" : ""} ${hasActiveEntry ? "is-active" : ""}`}
                    >
                      <button
                        type="button"
                        className="docs-nav-group__toggle"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() =>
                          setExpandedGroups((previous) =>
                            previous.includes(group.key)
                              ? previous.filter((key) => key !== group.key)
                              : [...previous, group.key],
                          )
                        }
                      >
                        <span className="docs-nav-group__title">
                          {resolveLocalizedText(group.label, t)}
                        </span>
                        <ChevronRight
                          size={16}
                          className={`docs-nav-group__icon ${isOpen ? "is-open" : ""}`}
                        />
                      </button>

                      {isOpen ? (
                        <div id={panelId} className="docs-nav-list">
                          {groupEntries.map((entry) => {
                            const isActive = entry.slug === currentDoc.slug;

                            return (
                              <section key={entry.slug} className={`docs-nav-entry ${isActive ? "is-active" : ""}`}>
                                <Link
                                  to={toDocPath(entry.slug)}
                                  className={`docs-nav-link ${isActive ? "is-active" : ""}`}
                                  aria-current={isActive ? "page" : undefined}
                                >
                                  <span className="docs-nav-link__copy">
                                    <span className="docs-nav-link__title">
                                      {resolveLocalizedText(entry.navLabel, t)}
                                    </span>
                                  </span>
                                </Link>
                              </section>
                            );
                          })}
                        </div>
                      ) : null}
                    </section>
                  );
                })}

              </div>
            </div>
          </aside>

          <article className="docs-article">
            <div className="docs-article__meta">
              {!isOverviewDoc ? <p className="docs-article__eyebrow">{currentDocNavLabel}</p> : null}
              <h2 className="docs-article__title">{currentDocTitle}</h2>
              <p className="docs-article__description">{currentDocDescription}</p>
              <div className="docs-article__path">
                <span>{t("来源", "Source")}</span>
                <code>frontend/docs/{currentDoc.slug === DEFAULT_DOC_SLUG ? "README" : currentDoc.slug}.md</code>
              </div>
            </div>

            <MarkdownDocument blocks={articleBlocks} />
          </article>

          {currentOutline.length > 0 ? (
            <aside className="docs-outline-rail" aria-label={t("本页目录", "On This Page")}>
              <div className="docs-outline">
                <div className="docs-outline__header">
                  <p className="docs-outline__eyebrow">{t("本页目录", "On This Page")}</p>
                  {!isOverviewDoc ? <h3 className="docs-outline__title">{currentDocNavLabel}</h3> : null}
                </div>

                <div className="docs-outline__list">
                  {currentOutline.map((heading) => (
                    <Link
                      key={`${currentDoc.slug}-${heading.id}`}
                      to={`${toDocPath(currentDoc.slug)}#${heading.id}`}
                      className={`docs-outline__link level-${heading.level} ${
                        activeHeadingId === heading.id ? "is-active" : ""
                      }`}
                    >
                      {stripMarkdownSyntax(heading.text)}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          ) : null}
        </section>
      </div>
    </div>
  );
}
