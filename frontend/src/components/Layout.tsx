import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Market Intelligence', path: '/market-intelligence', icon: 'insights' },
    { name: 'Inventory', path: '/inventory', icon: 'opacity' },
    { name: 'Sales Strategy', path: '/strategy', icon: 'psychology' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Side Navigation Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-surface-container-lowest border-r border-outline-variant z-50">
        <div className="flex flex-col h-full py-lg px-md">
          {/* Brand Identity */}
          <div className="flex items-center gap-sm mb-xxl">
            <div className="flex flex-col gap-xs">
              <img 
                alt="Mascot.AI Logo" 
                className="h-12 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmkhQ48QNEbrk--Inpooo3LBcF45ZKQuhswwk9BFKKNjHG1FcQkII4enCFrJEBlrWXtDAtFaypdyhOPYpu_N6oawoefQOz-uxljOb91mjjt4nl3Ir8Ff1H5WZ6OoMEey3rkfSW-QqZoo2_gJqJbhSZSH26sT4rPfbb5NxvnBzxgJCgzkyUoZfbX_ZC5TQMjrAJgSluLIQCgASoKR0z22d0RG5i9g8tXQF5EgQ6XCrQqY6Uro4tJewe5fSq36NkUxF_1G4"
              />
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Sales Intelligence</p>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="flex-1 space-y-xs">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path.split('/1')[0]));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-low'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <span 
                    className="material-symbols-outlined" 
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className="font-label-caps text-label-caps">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Footer Actions */}
          <div className="mt-auto pt-lg border-t border-outline-variant space-y-xs">
            <button className="w-full bg-primary text-white font-bold py-sm rounded-lg flex items-center justify-center gap-sm active:scale-95 transition-transform mb-md shadow-sm">
              <span className="material-symbols-outlined">add</span>
              <span className="font-label-caps text-label-caps">New Paint Order</span>
            </button>
            <Link to="/settings" className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-caps text-label-caps">Settings</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        <main className="flex-1 bg-background min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
