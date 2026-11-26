import type { ReactNode } from 'react';

/** The shape of packages/core/dist-docs/custom-elements.json (the parts the explorer shows). */
export interface ManifestDeclaration {
  tagName: string;
  name: string;
  description?: string;
  attributes: { name: string; type: { text: string }; default?: string; description?: string }[];
  events: { name: string; type: { text: string }; description?: string }[];
  methods: { name: string; parameters?: string; description?: string }[];
  slots: { name: string }[];
}

function Section({ title, empty, children }: { title: string; empty: string; children?: ReactNode }) {
  const has = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div className="kvui-stack kvui-stack-xs">
      <h4 className="kvui-h6">{title}</h4>
      {has ? children : <p className="kvui-caption">{empty}</p>}
    </div>
  );
}

/** Props, events, methods and slots for one component, as documented in the source. */
export function ApiTable({ decl }: { decl: ManifestDeclaration }) {
  const props = decl.attributes;
  return (
    <div className="kvui-stack kvui-stack-lg">
      <Section title={`Properties (${props.length})`} empty="No properties.">
        {props.length > 0 && (
          <div className="kvui-table-wrap">
            <table className="kvui-table">
              <thead><tr><th>Attribute</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name}>
                    <td><code>{p.name}</code></td>
                    <td><code>{p.type.text}</code></td>
                    <td>{p.default ? <code>{p.default}</code> : ''}</td>
                    <td>{p.description ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      <Section title={`Events (${decl.events.length})`} empty="This component emits no events.">
        {decl.events.length > 0 && (
          <ul className="kvui-stack kvui-stack-xs kvui-small" role="list">
            {decl.events.map((e) => (
              <li key={e.name}><code>{e.name}</code> <span className="kvui-text-muted">detail: <code>{e.type.text}</code></span>{e.description ? ` ${e.description}` : ''}</li>
            ))}
          </ul>
        )}
      </Section>
      <Section title={`Methods (${decl.methods.length})`} empty="No methods.">
        {decl.methods.length > 0 && (
          <ul className="kvui-stack kvui-stack-xs kvui-small" role="list">
            {decl.methods.map((m) => <li key={m.name}><code>{m.name}({m.parameters ?? ''})</code>{m.description ? ` ${m.description}` : ''}</li>)}
          </ul>
        )}
      </Section>
      <Section title={`Slots (${decl.slots.length})`} empty="No named slots. Content goes in the default slot.">
        {decl.slots.length > 0 && (
          <ul className="kvui-cluster kvui-small" role="list">
            {decl.slots.map((s) => <li key={s.name || 'default'}><code>{s.name || 'default'}</code></li>)}
          </ul>
        )}
      </Section>
    </div>
  );
}
