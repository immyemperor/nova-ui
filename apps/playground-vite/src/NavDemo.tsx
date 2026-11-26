import { useState } from 'react';
import {
  UiAccordion, UiAccordionItem, UiBreadcrumb, UiBreadcrumbItem, UiButton, UiMenuItem, UiMenubar,
  UiMenubarMenu, UiNavItem, UiNavMenu, UiPagination, UiStep, UiStepper, UiTab, UiTabPanel, UiTabs, toast,
} from '@kvui/react';

export function NavDemo() {
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(4);

  return (
    <section className="kvui-stack kvui-stack-lg" id="navigation">
      <h2 className="kvui-h3">Navigation</h2>

      <UiMenubar>
        <UiMenubarMenu label="File" onUiSelect={(e) => toast(`File: ${e.detail.label}`)}>
          <UiMenuItem shortcut="Ctrl N">New</UiMenuItem>
          <UiMenuItem shortcut="Ctrl O">Open</UiMenuItem>
          <UiMenuItem divider>Exit</UiMenuItem>
        </UiMenubarMenu>
        <UiMenubarMenu label="Edit" onUiSelect={(e) => toast(`Edit: ${e.detail.label}`)}>
          <UiMenuItem shortcut="Ctrl Z">Undo</UiMenuItem>
          <UiMenuItem shortcut="Ctrl Y">Redo</UiMenuItem>
        </UiMenubarMenu>
        <UiMenubarMenu label="View">
          <UiMenuItem>Zoom in</UiMenuItem>
          <UiMenuItem disabled>Full screen</UiMenuItem>
        </UiMenubarMenu>
      </UiMenubar>

      <UiNavMenu label="Site">
        <UiNavItem label="Home" href="#" current />
        <UiNavItem label="Products">
          <a href="#analytics">Analytics</a>
          <a href="#automation">Automation</a>
          <a href="#reports">Reports</a>
        </UiNavItem>
        <UiNavItem label="Docs" href="#docs" />
      </UiNavMenu>

      <UiBreadcrumb maxItems={3}>
        <UiBreadcrumbItem href="#">Home</UiBreadcrumbItem>
        <UiBreadcrumbItem href="#">Projects</UiBreadcrumbItem>
        <UiBreadcrumbItem href="#">Kvui</UiBreadcrumbItem>
        <UiBreadcrumbItem href="#">Components</UiBreadcrumbItem>
        <UiBreadcrumbItem>Navigation</UiBreadcrumbItem>
      </UiBreadcrumb>

      <UiTabs label="Project sections" value="overview">
        <UiTab value="overview">Overview</UiTab>
        <UiTab value="activity">Activity</UiTab>
        <UiTab value="settings">Settings</UiTab>
        <UiTab value="billing" disabled>Billing</UiTab>
        <UiTabPanel value="overview">Overview content. Use arrow keys to move between tabs.</UiTabPanel>
        <UiTabPanel value="activity">Recent activity appears here.</UiTabPanel>
        <UiTabPanel value="settings">Project settings.</UiTabPanel>
        <UiTabPanel value="billing">Billing.</UiTabPanel>
      </UiTabs>

      <UiTabs variant="pills" value="a">
        <UiTab value="a">Day</UiTab>
        <UiTab value="b">Week</UiTab>
        <UiTab value="c">Month</UiTab>
        <UiTabPanel value="a">Daily view</UiTabPanel>
        <UiTabPanel value="b">Weekly view</UiTabPanel>
        <UiTabPanel value="c">Monthly view</UiTabPanel>
      </UiTabs>

      <UiAccordion>
        <UiAccordionItem heading="What is Kvui UI?" open>
          A framework-agnostic component library built with web components.
        </UiAccordionItem>
        <UiAccordionItem heading="Does it work with Angular?">
          Yes. Generated standalone proxies and form value accessors are included.
        </UiAccordionItem>
        <UiAccordionItem heading="Is dark mode supported?">
          Light, dark and system modes, with no flash on load in Next.js.
        </UiAccordionItem>
      </UiAccordion>

      <div className="kvui-stack">
        <UiStepper current={step} clickable onUiChange={(e) => setStep(e.detail)}>
          <UiStep heading="Account" description="Your details" />
          <UiStep heading="Workspace" description="Name it" />
          <UiStep heading="Invite" description="Add teammates" />
          <UiStep heading="Done" />
        </UiStepper>
        <div className="kvui-cluster">
          <UiButton variant="secondary" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</UiButton>
          <UiButton size="sm" onClick={() => setStep((s) => Math.min(3, s + 1))}>Next</UiButton>
        </div>
      </div>

      <div className="kvui-stack kvui-stack-sm">
        <UiPagination page={page} total={240} pageSize={10} onUiChange={(e) => setPage(e.detail)} />
        <span className="kvui-small kvui-text-muted">Page {page} of 24</span>
      </div>
    </section>
  );
}
