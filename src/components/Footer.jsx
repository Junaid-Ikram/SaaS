import { FaFacebookF, FaGithub, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const navSections = [
  {
    title: 'Product',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Academy Owners', to: '/features#academy-owners' },
      { label: 'Teachers', to: '/features#teachers' },
      { label: 'Students', to: '/features#students' },
      { label: 'Success Stories', to: '/features#success-stories' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
      { label: 'Accessibility', to: '/accessibility' },
    ],
  },
];

const socialLinks = [
  { label: 'Facebook', href: '#', Icon: FaFacebookF },
  { label: 'Twitter', href: '#', Icon: FaTwitter },
  { label: 'LinkedIn', href: '#', Icon: FaLinkedinIn },
  { label: 'GitHub', href: '#', Icon: FaGithub },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="max-w-6xl px-6 mx-auto py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-white">
              <span className="flex items-center justify-center w-10 h-10 text-xl font-bold rounded-xl bg-emerald-500">
                Q
              </span>
              Q Edu
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              All-in-one operating system for modern academies. Power enrolment, live classes,
              payment workflows, and community management from a single dashboard.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center transition border rounded-full h-9 w-9 border-slate-700 text-slate-300 hover:border-emerald-400 hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="transition text-slate-400 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
              Stay in the loop
            </h3>
            <p className="mt-4 text-sm text-slate-400">
              Subscribe for release notes, invite-only webinars, and early feature previews.
            </p>
            <form className="flex flex-col gap-3 mt-4 sm:flex-row">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 text-sm text-white border rounded-lg border-slate-700 bg-slate-800 placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition rounded-lg bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 mt-12 text-sm border-t border-slate-700 text-slate-500">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>&copy; {currentYear} Q Edu. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="transition hover:text-white">
                Terms
              </Link>
              <a href="mailto:support@qedu.io" className="transition hover:text-white">
                support@qedu.io
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
