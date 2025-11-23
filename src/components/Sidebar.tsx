'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SidebarProps {
    title: string;
    links: { href: string; label: string }[];
    logoutAction: () => void;
}

export default function Sidebar({ title, links, logoutAction }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="btn btn-outline mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 50,
                    background: 'var(--card-bg)',
                    backdropFilter: 'blur(12px)',
                    padding: '0.5rem',
                    display: 'none', // Hidden on desktop via CSS
                }}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 30,
                    }}
                    onClick={() => setIsOpen(false)}
                    className="mobile-overlay"
                />
            )}

            {/* Sidebar Aside */}
            <aside
                className={`glass sidebar ${isOpen ? 'open' : ''}`}
                style={{
                    width: '250px',
                    borderRight: '1px solid var(--border)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 40,
                    transition: 'transform 0.3s ease',
                    left: 0,
                    top: 0,
                    // Transform logic will be handled by CSS media queries or inline styles
                }}
            >
                <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{title}</h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="nav-link"
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                    border: isActive ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid transparent'
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <form action={logoutAction}>
                        <button type="submit" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
