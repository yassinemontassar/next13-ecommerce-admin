"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Acceuil',
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Affiches',
            active: pathname === `/${params.storeId}/billboards`,
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Catégories',
            active: pathname === `/${params.storeId}/categories`,
        },
        {
            href: `/${params.storeId}/sizes`,
            label: 'Tailles',
            active: pathname === `/${params.storeId}/sizes`,
        },
        {
            href: `/${params.storeId}/colors`,
            label: 'Couleurs',
            active: pathname === `/${params.storeId}/colors`,
        },
        {
            href: `/${params.storeId}/products`,
            label: 'Produits',
            active: pathname === `/${params.storeId}/products`,
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Commandes',
            active: pathname === `/${params.storeId}/orders`,
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Paramètres',
            active: pathname === `/${params.storeId}/settings`,
        },
        {
            href: `/${params.storeId}/subscribers`,
            label: 'Abonnés',
            active: pathname === `/${params.storeId}/subscribers`,
        },
    ];

    return (
       <nav 
       className={cn("flex items-center space-x-4 lg:space-x-6", className)}
       >
        {routes.map((route) => (
            <Link
            key={route.href}
            href={route.href}
            className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-black dark:text-white" : "text-muted-foreground"
            )}
            >
            {route.label}
            </Link>
        ))}
       </nav>
    )

};