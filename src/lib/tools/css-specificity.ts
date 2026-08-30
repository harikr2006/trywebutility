export interface Specificity {
  ids: number;    // a
  classes: number; // b (classes, attributes, pseudo-classes)
  elements: number; // c (elements, pseudo-elements)
  score: string;  // "a,b,c"
  total: number;  // a*100 + b*10 + c
}

export function calcSpecificity(selector: string): { result: Specificity | null; error: string | null } {
  try {
    if (!selector.trim()) return { result: null, error: null };

    let s = selector.trim();

    // Remove pseudo-element content (::before etc.)
    // Count pseudo-elements (::) as c
    let pe = 0;
    s = s.replace(/::[\w-]+/g, () => { pe++; return ""; });

    // Count IDs (#id)
    let ids = 0;
    s = s.replace(/#[\w-]+/g, () => { ids++; return ""; });

    // Count attribute selectors [attr]
    let attrs = 0;
    s = s.replace(/\[[^\]]*\]/g, () => { attrs++; return ""; });

    // Count pseudo-classes (:hover, :nth-child etc.) but NOT :not() wrapper
    // :not() content contributes but the :not itself doesn't
    let pseudoClasses = 0;
    s = s.replace(/:not\(([^)]*)\)/g, (_, inner) => {
      // parse inner selector recursively
      const inner_r = calcSpecificity(inner);
      if (inner_r.result) {
        ids += inner_r.result.ids;
        attrs += inner_r.result.classes;
        pe += inner_r.result.elements;
      }
      return "";
    });
    s = s.replace(/:[\w-]+(?:\([^)]*\))?/g, () => { pseudoClasses++; return ""; });

    // Count classes (.class)
    let classes = 0;
    s = s.replace(/\.[\w-]+/g, () => { classes++; return ""; });

    // What's left are element selectors (tag names) and combinators
    // Remove combinators and universal selector
    s = s.replace(/[>+~\s*]/g, " ");

    // Count remaining words as element selectors
    const elements = pe + s.trim().split(/\s+/).filter(w => w && /^[a-zA-Z][\w-]*$/.test(w)).length;
    const b = classes + attrs + pseudoClasses;

    return {
      result: {
        ids,
        classes: b,
        elements,
        score: `${ids},${b},${elements}`,
        total: ids * 100 + b * 10 + elements,
      },
      error: null,
    };
  } catch (e) {
    return { result: null, error: e instanceof Error ? e.message : "Parse failed" };
  }
}

export function compareSpecificity(a: Specificity, b: Specificity): -1 | 0 | 1 {
  if (a.ids !== b.ids) return a.ids > b.ids ? 1 : -1;
  if (a.classes !== b.classes) return a.classes > b.classes ? 1 : -1;
  if (a.elements !== b.elements) return a.elements > b.elements ? 1 : -1;
  return 0;
}
