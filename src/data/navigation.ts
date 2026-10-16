import type { NavLink } from '../types';
import { isSectionOn } from './settings';

/**
 * Site navigation. `navLinks` drives the header menu (the logo links home);
 * `footerNavLinks` is the list shown in the footer. Each href must match a
 * section id on the page.
 */

const allNavLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Fleet', href: '#vehicles' },
  { label: 'Tours', href: '#tours' },
  { label: 'Plan Trip', href: '#calculator' },
  { label: 'Rates', href: '#pricing' },
  { label: 'Offers', href: '#offers' },
  { label: 'Contact', href: '#contact' },
];

const allFooterNavLinks: NavLink[] = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#about' },
  { label: 'Odisha Destinations', href: '#destinations' },
  { label: 'Cars & Fleet', href: '#vehicles' },
  { label: 'Odisha Tour Packages', href: '#tours' },
  { label: 'Trip Planner', href: '#calculator' },
  { label: 'Rental Tariffs', href: '#pricing' },
  { label: 'Special Offers', href: '#offers' },
  { label: 'Contact', href: '#contact' },
];

const visible = (link: NavLink) => isSectionOn(link.href.replace('#', ''));

export const navLinks = allNavLinks.filter(visible);
export const footerNavLinks = allFooterNavLinks.filter(visible);
