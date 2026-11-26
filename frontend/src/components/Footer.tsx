import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Database, Code2, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">SmartCampus</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A comprehensive lost & found management ecosystem designed for college campuses.
              Built with Java Spring Boot, MySQL, and modern React for secure, transparent recovery of student belongings.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-medium text-teal-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Campus Security Portal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-teal-400 transition-colors">Browse Found Items</Link>
              </li>
              <li>
                <Link to="/user/report-lost" className="hover:text-teal-400 transition-colors">Report Lost Item</Link>
              </li>
              <li>
                <Link to="/user/report-found" className="hover:text-teal-400 transition-colors">Register Found Item</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">Project Architecture & OOP</Link>
              </li>
            </ul>
          </div>

          {/* System & Academic Details */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Technical Architecture</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Backend: Java Spring Boot 3 &amp; JPA</span>
              </li>
              <li className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-teal-400" />
                <span>Database: MySQL 8 with ACID Transactions</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Security: Spring Security &amp; JWT</span>
              </li>
              <li className="mt-2 text-[11px] text-slate-400 italic">
                Demonstrates OOP inheritance, polymorphism, encapsulation, and relational normalization.
              </li>
            </ul>
          </div>

          {/* Campus Helpline */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Campus Security Desk</h3>
            <div className="space-y-2.5 text-xs">
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Admin Block, Ground Floor, Room 102</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>+91-9876543210 (Security Desk)</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>security@campus.edu</span>
              </p>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                >
                  Administrator Access Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Smart Campus Lost &amp; Found System. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Developed for College Project Demonstration</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

