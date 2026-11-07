import { Component, Element, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import type { TreeNode } from '../../types';

@Component({
  tag: 'ui-tree',
  styleUrl: 'ui-tree.css',
  shadow: true,
})
export class UiTree {
  @Element() host!: HTMLElement;

  @Prop() nodes: TreeNode[] = [];
  @Prop({ mutable: true }) expanded: string[] = [];
  @Prop({ mutable: true }) selected?: string;
  @Prop() label = 'Tree';

  @Event() uiExpandChange!: EventEmitter<string[]>;
  @Event() uiSelect!: EventEmitter<string>;

  private isExpanded(id: string): boolean {
    return this.expanded.includes(id);
  }

  private toggle(id: string, open = !this.isExpanded(id)) {
    const next = open ? [...new Set([...this.expanded, id])] : this.expanded.filter((item) => item !== id);
    this.expanded = next;
    this.uiExpandChange.emit(next);
  }

  private select(node: TreeNode) {
    if (node.disabled) return;
    this.selected = node.id;
    this.uiSelect.emit(node.id);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
    if (!item) return;
    const items = Array.from(this.host.shadowRoot?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? []);
    const index = items.indexOf(item);
    const id = item.dataset.id;
    if (!id) return;
    let target: HTMLElement | undefined;
    if (event.key === 'ArrowDown') target = items[index + 1];
    else if (event.key === 'ArrowUp') target = items[index - 1];
    else if (event.key === 'Home') target = items[0];
    else if (event.key === 'End') target = items[items.length - 1];
    else if (event.key === 'ArrowRight') {
      const node = this.findNode(id, this.nodes);
      if (node?.children?.length && !this.isExpanded(id)) {
        this.toggle(id, true);
        requestAnimationFrame(() => {
          const child = Array.from(this.host.shadowRoot?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? []).find((candidate) => candidate.dataset.parent === id);
          child?.focus();
        });
      }
      else target = items[index + 1];
    } else if (event.key === 'ArrowLeft') {
      if (this.isExpanded(id)) this.toggle(id, false);
      else {
        const parentId = item.dataset.parent;
        target = parentId ? items.find((candidate) => candidate.dataset.id === parentId) : undefined;
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const node = this.findNode(id, this.nodes);
      if (node) this.select(node);
      return;
    } else return;
    event.preventDefault();
    target?.focus();
  };

  private findNode(id: string, nodes: TreeNode[]): TreeNode | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      const nested = node.children && this.findNode(id, node.children);
      if (nested) return nested;
    }
    return undefined;
  }

  private renderNodes(nodes: TreeNode[], parentId?: string, level = 1) {
    return nodes.map((node) => {
      const children = node.children ?? [];
      const open = this.isExpanded(node.id);
      return (
        <li role="none" key={node.id}>
          <div
            class={{ item: true, selected: this.selected === node.id, disabled: !!node.disabled }}
            role="treeitem"
            aria-level={level}
            aria-expanded={children.length ? String(open) : undefined}
            aria-selected={String(this.selected === node.id)}
            aria-disabled={node.disabled ? 'true' : undefined}
            data-id={node.id}
            data-parent={parentId}
            tabindex={this.selected === node.id || (!this.selected && level === 1 && node === this.nodes[0]) ? 0 : -1}
            onClick={() => this.select(node)}
          >
            {children.length ? <span class="disclosure" aria-hidden="true">{open ? '▾' : '▸'}</span> : <span class="disclosure blank" aria-hidden="true" />}
            <span>{node.label}</span>
          </div>
          {children.length > 0 && open && <ul role="group">{this.renderNodes(children, node.id, level + 1)}</ul>}
        </li>
      );
    });
  }

  render() {
    return <Host><ul class="tree" role="tree" aria-label={this.label} onKeyDown={this.onKeyDown}>{this.renderNodes(this.nodes)}</ul></Host>;
  }
}