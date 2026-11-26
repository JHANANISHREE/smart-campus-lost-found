import React from 'react';
import {
  Compass,
  Database,
  Code2,
  ShieldCheck,
  Server,
  Layout,
  CheckCircle2,
  Layers,
  Sparkles,
  GitBranch,
  Terminal,
  Cpu,
  FileCheck
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Academic Project Demonstration • Java OOP &amp; DBMS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Smart Campus Lost &amp; Found Management System
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          A full-stack, enterprise-style web application designed to automate, streamline, and secure the process of reporting lost belongings, registering found items, and handling ownership verification on college campuses.
        </p>
      </div>

      {/* PROBLEM STATEMENT & OBJECTIVES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Problem Statement</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Misplaced laptops, smartwatches, ID cards, and books frequently cause anxiety across large campus buildings. Traditional lost-and-found practices rely on unindexed paper logbooks, crowded notice boards, and chaotic informal social media groups. This causes low recovery rates, lack of privacy, and vulnerabilities to fraudulent claims.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Project Objectives</h2>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Provide a centralized, real-time portal for reporting lost and found items.</li>
            <li>Enforce role-based access control (RBAC) separating Student and Admin privileges.</li>
            <li>Protect student identity by concealing unique item traits to prevent fraudulent claims.</li>
            <li>Maintain an immutable audit trail of all item states, claims, and approvals.</li>
            <li>Demonstrate core Java Object-Oriented Programming (OOP) and DBMS relational concepts.</li>
          </ul>
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE OVERVIEW */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">System Architecture &amp; Technology Stack</h2>
            <p className="text-xs text-slate-400">Decoupled Three-Tier Architecture (Client-Server-Database)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Frontend Tier */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
              <Layout className="w-4 h-4" />
              <span>Presentation Tier</span>
            </div>
            <h4 className="text-sm font-bold text-white">React + Vite + TypeScript</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tailwind CSS for responsive design, Lucide icons, React Router DOM, Axios HTTP client with JWT interceptor, and Recharts for live analytical dashboard graphs.
            </p>
          </div>

          {/* Backend Tier */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Server className="w-4 h-4" />
              <span>Application Tier</span>
            </div>
            <h4 className="text-sm font-bold text-white">Java Spring Boot 3 &amp; JPA</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Spring Web MVC REST APIs, Spring Security 6 with BCrypt and Stateless JWT Filter, Spring Data JPA / Hibernate ORM, and DataInitializer bootstrap runner.
            </p>
          </div>

          {/* Database Tier */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>Data Tier</span>
            </div>
            <h4 className="text-sm font-bold text-white">MySQL 8.0 Engine</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Normalized relational schema (users, categories, lost_items, found_items, claims, notifications, item_history), foreign keys with cascading, indexes, and ACID transactions.
            </p>
          </div>
        </div>
      </div>

      {/* OOP CONCEPTS DEMONSTRATION */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Java Object-Oriented Programming (OOP) Implementation</h2>
            <p className="text-xs text-slate-500">How Academic OOP Concepts are Embedded in Real Application Code</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Encapsulation */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>1. Encapsulation</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Entity classes (<code className="text-indigo-600 font-mono">User</code>, <code className="text-indigo-600 font-mono">BaseItem</code>, <code className="text-indigo-600 font-mono">Claim</code>) maintain strictly <code className="font-mono">private</code> attributes accessed only via explicit getters, setters, constructors, and validation guards.
            </p>
          </div>

          {/* Inheritance */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>2. Inheritance</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              <code className="text-indigo-600 font-mono">BaseItem</code> acts as an abstract base class containing common campus item properties (code, name, category, location, image, reportedBy, status). Both <code className="font-mono">LostItem extends BaseItem</code> and <code className="font-mono">FoundItem extends BaseItem</code> inherit from this base class.
            </p>
          </div>

          {/* Polymorphism */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>3. Polymorphism</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Abstract methods <code className="text-indigo-600 font-mono">getItemType()</code> and <code className="text-indigo-600 font-mono">isPendingAction()</code> in <code className="font-mono">BaseItem</code> are overridden polymorphically by <code className="font-mono">LostItem</code> and <code className="font-mono">FoundItem</code> to implement concrete domain behavior.
            </p>
          </div>

          {/* Abstraction */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>4. Abstraction</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear separation between Service Interfaces (<code className="text-indigo-600 font-mono">ClaimService</code>, <code className="text-indigo-600 font-mono">AuthService</code>, <code className="text-indigo-600 font-mono">LostItemService</code>) and their concrete Spring implementations (<code className="font-mono">ClaimServiceImpl</code>, etc.), isolating business rules from data access.
            </p>
          </div>
        </div>
      </div>

      {/* DBMS RELATIONAL DESIGN & NORMALIZATION */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Database Management System (DBMS) Implementation</h2>
            <p className="text-xs text-slate-500">Relational Modeling, Normalization, and ACID Transactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">3NF Normalization</span>
            <p className="text-slate-600">
              Tables eliminate transitive dependencies and data anomalies. Categories, users, reports, and claims are normalized into independent entities.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">Foreign Keys &amp; Integrity</span>
            <p className="text-slate-600">
              Enforces relational constraints (<code className="font-mono">ON DELETE CASCADE</code> for claims and notifications; <code className="font-mono">ON DELETE SET NULL</code> for audit records).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">B-Tree Indexes</span>
            <p className="text-slate-600">
              High-throughput queries on user emails, registration numbers, item codes, dates, and categories utilize database indexes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">ACID Transactions</span>
            <p className="text-slate-600">
              <code className="text-indigo-600 font-mono">@Transactional</code> guarantees atomic state transitions when approving claims, updating items, and recording audit logs simultaneously.
            </p>
          </div>
        </div>
      </div>

      {/* DEMO PROTOCOL & EVALUATOR CREDENTIALS */}
      <div className="bg-gradient-to-br from-indigo-50 to-teal-50 rounded-3xl p-6 sm:p-10 border border-indigo-200/80 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Faculty &amp; Evaluator Demonstration Protocol</h2>
            <p className="text-xs text-slate-600">Preset Credentials for Interactive Live Testing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Account */}
          <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              ADMINISTRATOR ACCOUNT
            </span>
            <div className="text-xs space-y-1 pt-1 font-mono">
              <p><span className="text-slate-400 font-sans">Email:</span> <span className="font-bold text-slate-800">admin@campus.edu</span></p>
              <p><span className="text-slate-400 font-sans">Password:</span> <span className="font-bold text-slate-800">Admin@123</span></p>
              <p><span className="text-slate-400 font-sans">Role:</span> <span className="text-indigo-600 font-bold">ROLE_ADMIN</span></p>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Provides access to the Administrative Dashboard, Claim Verification, Student Management, and Audit logs.
            </p>
          </div>

          {/* Student Account */}
          <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-sm space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              DEMO STUDENT ACCOUNT
            </span>
            <div className="text-xs space-y-1 pt-1 font-mono">
              <p><span className="text-slate-400 font-sans">Email:</span> <span className="font-bold text-slate-800">student@campus.edu</span></p>
              <p><span className="text-slate-400 font-sans">Password:</span> <span className="font-bold text-slate-800">Student@123</span></p>
              <p><span className="text-slate-400 font-sans">Role:</span> <span className="text-teal-600 font-bold">ROLE_STUDENT</span></p>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Enables testing Lost/Found reporting, Claim submissions, Notifications, and personal dashboard metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

