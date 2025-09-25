@@ .. @@
-import React from 'react';
+import React, { useState, useEffect } from 'react';
+import LandingPage from './components/LandingPage';
+import AuthModal from './components/AuthModal';
+import StudentDashboard from './components/StudentDashboard';
+import TeacherDashboard from './components/TeacherDashboard';

 function App() {
+  const [currentView, setCurrentView] = useState<'landing' | 'student' | 'teacher'>('landing');
+  const [showAuthModal, setShowAuthModal] = useState(false);
+  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
+  const [currentUser, setCurrentUser] = useState<any>(null);
+
+  useEffect(() => {
+    // Check if user is already logged in
+    const savedUser = localStorage.getItem('currentUser');
+    if (savedUser) {
+      const user = JSON.parse(savedUser);
+      setCurrentUser(user);
+      setCurrentView(user.role);
+    }
+  }, []);
+
+  const handleRoleSelect = (role: 'student' | 'teacher') => {
+    setSelectedRole(role);
+    setShowAuthModal(true);
+  };
+
+  const handleLogin = (userData: any) => {
+    setCurrentUser(userData);
+    setCurrentView(selectedRole);
+    setShowAuthModal(false);
+  };
+
+  const handleLogout = () => {
+    localStorage.removeItem('currentUser');
+    setCurrentUser(null);
+    setCurrentView('landing');
+  };
+
+  const handleHome = () => {
+    setCurrentView('landing');
+  };
+
+  if (currentView === 'student' && currentUser) {
+    return (
+      <StudentDashboard 
+        user={currentUser} 
+        onLogout={handleLogout}
+        onHome={handleHome}
+      />
+    );
+  }
+
+  if (currentView === 'teacher' && currentUser) {
+    return (
+      <TeacherDashboard 
+        user={currentUser} 
+        onLogout={handleLogout}
+        onHome={handleHome}
+      />
+    );
+  }
+
   return (
-    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
-      <p>Start prompting (or editing) to see magic happen :)</p>
-    </div>
+    <>
+      <LandingPage onRoleSelect={handleRoleSelect} />
+      <AuthModal
+        isOpen={showAuthModal}
+        onClose={() => setShowAuthModal(false)}
+        role={selectedRole}
+        onLogin={handleLogin}
+      />
+    </>
   );
 }