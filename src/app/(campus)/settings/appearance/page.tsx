import { ThemePicker } from '@/components/theme-picker';

export default function AppearanceSettings() {
  return <>
    <div className="page-head"><div><div className="eyebrow">Make it yours</div><h1>Appearance</h1><p>Choose a color theme for your campus desk.</p></div></div>
    <section className="card appearance-card" aria-labelledby="theme-heading">
      <div className="appearance-heading"><div><h2 id="theme-heading">Color theme</h2><p>Changes apply right away.</p></div></div>
      <ThemePicker />
    </section>
  </>;
}
