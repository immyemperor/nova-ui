import { Component, Element, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import type { TreeNode } from '../../types';

interface Flat {
  node: TreeNode;
  level: number;
  parent?: TreeNode;
}

/**
 * Expandable tree with single selection. Follows the ARIA tree pattern:
 * Up/Down move, Right expands or enters, Left collapses or goes to the parent, Home/End jump.
 */
@Component({
  tag: 'ui-tree',
  styleUrl: 'ui-tree.css',
  shadow: true,
})
export class UiTree {
  @Element() host!: HTMLElement;

  @Prop() nodes: TreeNode[] = [];
  /** Id of the selected node. */
  @Prop({ mutable: true }) selected?: string;
  /** Ids of the expanded nodes. */
  @Prop({ mutable: true }) expanded: string[] = [];
  @Prop() label = 'Tree';

  @State() focusId?: string;

  @Event() uiSelect!: EventEmitter<{ id: string; node: TreeNode }>;
  @Event() uiToggle!: EventEmitter<{ id: string; expanded: boolean }>;

  /** Visible nodes in display order. */
  private visible(): Flat[] {
    const out: Flat[] = [];
    const open = new Set(this.expanded);
    const walk = (nodes: TreeNode[], level: number, parent?: TreeNode) => {
      for (const node of nodes) {
        out.push({ node, level, parent });
        if (node.children?.length && open.has(node.id)) walk(node.children, level + 1, node);
      }
    };
    walk(this.nodes, 1);
    return out;
  }

  private setExpanded(id: string, expand: boolean) {
    const set = new Set(this.expanded);
    if (expand === set.has(id)) return;
    if (expand) set.add(id);
    else set.delete(id);
    this.expanded = Array.from(set);
    this.uiToggle.emit({ id, expanded: expand });
  }

  private select(node: TreeNode) {
    if (node.disabled) return;
    this.selected = node.id;
    this.focusId = node.id;
    this.uiSelect.emit({ id: node.id, node });
  }

  private focusNode(id: string) {
    this.focusId = id;
    requestAnimationFrame(() => (this.host.shadowRoot?.getElementById(`node-${id}`) as HTMLElement | null)?.focus());
  }

  private onKeyDown = (e: KeyboardEvent, flat: Flat[], index: number) => {
    const cur = flat[index];
    const hasKids = !!cur.node.children?.length;
    const isOpen = this.expanded.includes(cur.node.id);
    const go = (i: number) => flat[i] && this.focusNode(flat[i].node.id);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        go(Math.min(flat.length - 1, index + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        go(Math.max(0, index - 1));
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (hasKids && !isOpen) this.setExpanded(cur.node.id, true);
        else if (hasKids) go(index + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (hasKids && isOpen) this.setExpanded(cur.node.id, false);
        else if (cur.parent) this.focusNode(cur.parent.id);
        break;
      case 'Home':
        e.preventDefault();
        go(0);
        break;
      case 'End':
        e.preventDefault();
        go(flat.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.select(cur.node);
        break;
    }
  };

  private renderNodes(nodes: TreeNode[], level: number, flat: Flat[], tabId: string | undefined): any[] {
    const open = new Set(this.expanded);
    return nodes.map((node) => {
      const hasKids = !!node.children?.length;
      const isOpen = hasKids && open.has(node.id);
      const index = flat.findIndex((f) => f.node.id === node.id);
      return (
        <li
          key={node.id}
          id={`node-${node.id}`}
          role="treeitem"
          class="item"
          aria-level={level}
          aria-expanded={hasKids ? (isOpen ? 'true' : 'false') : undefined}
          aria-selected={this.selected === node.id ? 'true' : 'false'}
          aria-disabled={node.disabled ? 'true' : undefined}
          tabindex={node.id === tabId ? 0 : -1}
          onFocus={(e) => e.target === e.currentTarget && (this.focusId = node.id)}
          onKeyDown={(e) => e.target === e.currentTarget && this.onKeyDown(e, flat, index)}
        >
          <div
            class={{ row: true, selected: this.selected === node.id, disabled: !!node.disabled }}
            style={{ paddingInlineStart: `calc(${level - 1} * var(--nova-space-5) + var(--nova-space-2))` }}
            onClick={() => this.select(node)}
          >
            <span
              class={{ toggle: true, open: isOpen, leaf: !hasKids }}
              aria-hidden="true"
              onClick={(e) => {
                e.stopPropagation();
                if (hasKids) this.setExpanded(node.id, !isOpen);
              }}
            >
              <ui-icon name="chevron-right" />
            </span>
            {node.icon && <ui-icon class="node-icon" name={node.icon} />}
            <span class="text">{node.label}</span>
          </div>
          {isOpen && (
            <ul role="group" class="group">
              {this.renderNodes(node.children!, level + 1, flat, tabId)}
            </ul>
          )}
        </li>
      );
    });
  }

  render() {
    const flat = this.visible();
    // One tab stop: the focused node, else the selected one, else the first.
    const tabId = [this.focusId, this.selected].find((id) => id && flat.some((f) => f.node.id === id)) ?? flat[0]?.node.id;
    return (
      <Host>
        <ul role="tree" class="tree" aria-label={this.label}>
          {this.renderNodes(this.nodes, 1, flat, tabId)}
        </ul>
      </Host>
    );
  }
}
