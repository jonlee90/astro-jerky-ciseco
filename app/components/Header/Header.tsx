import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, NavLink, useLocation} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderMenuQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import NavMobileBottom from './NavMobileBottom';
import { MobileHeader } from './MobileHeader';
import { DesktopHeader } from './DesktopHeader';
import { CartCount } from '../CartCount';
import { AnnouncementBar } from '../AnnouncementBar';
import { FREE_SHIPPING_THRESHOLD } from '~/lib/const';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { useMediaQuery } from 'react-responsive';
import useWindowScroll from './useWindowScroll';
import { TopHeader } from './TopHeader';
import { IconBundle, IconChicken, IconCow, IconHoney, IconPack, IconPepper, IconSpicy } from '../Icon';
import ButtonPrimary from '../Button/ButtonPrimary';
import SocialsList from '../SocialsList';

type Viewport = 'desktop' | 'mobile';
interface HeaderProps {
  header: HeaderMenuQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  primaryDomainUrl: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  primaryDomainUrl,
  publicStoreDomain
}: HeaderProps) {
  const {headerMenu} = header;
  const { pathname, state } = useLocation();
  const isHydrated = useIsHydrated();
  const [isAnnouncementBarVisible, setAnnouncementBarVisible] = useState(true);
  const isBackButton = isHydrated && (pathname.includes('/beef-jerky/') ? !!state : (pathname.includes('/bundle/') && true));
  const isBundlePage = isHydrated && !state && pathname.includes('/bundle/') && true;
  const mediaQueryDesktop = useMediaQuery({minWidth: 767});
  // Use default value (true) during SSR to prevent hydration mismatch
  const isDesktop = isHydrated ? mediaQueryDesktop : true;

  const [opacity, setOpacity] = useState<number>(1);
  const prevScrollY = useRef<number>(0);
  const { y } = useWindowScroll();
  useEffect(() => {
    if (y > prevScrollY.current && y > 150 && opacity !== 0.4) {
      setOpacity(0.4);
    } else if (y <= prevScrollY.current && opacity !== 1) {
      setOpacity(1);
    }
    prevScrollY.current = y;
  }, [y]);
  const content = [
    "FREE SHIPPING OVER $60",
    "SAME DAY SHIPPING",
    "Buy 3 bags for $33",
  ];
  return (
    <>
      {/*
        <MainNav openMenu={openMenu} openCart={openCart} isHome={isHome} />
      */}
      
      <TopHeader 
            isLoggedIn={isLoggedIn}
            headerMenu={headerMenu}
            publicStoreDomain={publicStoreDomain}
            primaryDomainUrl={primaryDomainUrl}
            isBackButton={isBackButton} 
            isBundlePage={isBundlePage}
            isAnnouncementBarVisible={isAnnouncementBarVisible}
      />
      
      <AnnouncementBar 
        content={content}
        setVisible={setAnnouncementBarVisible}
      />
          {isHydrated && (isBundlePage)  && (
              <>
                <CartCount
                  opacity={opacity}
                  className={`pdp-nav-button md:hidden right-5 ${isDesktop ? 'top-10' : 'bottom-5'}`}
                  showCart={true}
                />
              </>
          )}
    </>
  );
}

export function HeaderMenu({
  header,
  viewport,
  publicStoreDomain,
  primaryDomainUrl
}: {
  header: HeaderProps['header'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  primaryDomainUrl: HeaderProps['primaryDomainUrl'];
}) {
  const {mobileSideMenu} = header;
  const className = `header-menu-${viewport}`;
  const {close} = useAside();
  const renderIcon = (label: string, className = 'self-center') => {
    switch (label.toLowerCase()) { // Using lowercase comparison for case-insensitive match
      case 'hot & spicy':
        return <IconSpicy className={className} size={24} />;
      case 'bbq':
        return <IconHoney className={className} size={24} />;
      case 'chicken':
        return <IconChicken className={className} size={24} />;
      case 'peppered':
        return <IconPepper className={className} size={24} />;
      case 'shop curated packs':
        return <IconPack className={className} size={24} />;
      case 'build your own pack':
        return <IconBundle className={className} size={24} />;
      case 'shop all':
        return <IconCow className={className} size={24} />;
      default:
        return null;
    }
  };

    
  return (
    <nav className={className + ' grid grid-cols-1 gap-7 mt-14'} role="navigation">
      {(mobileSideMenu || '').items.map((item, i) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

          
        return (
          <div key={i} className={`grid grid-cols-1 ${item.items.length > 0 ? 'gap-7' : ''}`}>
            <NavLink
              className={`header-menu-item font-bold text-2xl`}
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              <div className="flex flex-row">
                {renderIcon(item.title)}
                <span className='ml-2'>{item.title}</span>
              </div>
            </NavLink>
            {item.items && (
              <div className='grid grid-cols-1 ml-5 gap-5'>
                {item.items.map((subItem) => (
                  <NavLink
                    className="header-menu-subItems text-xl"
                    end
                    key={subItem.id}
                    onClick={close}
                    prefetch="intent"
                    style={activeLinkStyle}
                    to={subItem.url}
                  >
                    <div className="flex flex-row">
                      {renderIcon(subItem.title)}
                      <span className='ml-2'>{subItem.title}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className='grid grid-cols-1 gap-5 mt-10 absolute bottom-5'>

        <SocialsList
          data={header?.socials?.edges.map((edge) => {
            const node = edge.node;
            return {
              name: node.title?.value || '',
              icon: node.icon?.reference?.image?.url || '',
              href: node.link?.value || '',
            };
          })}
          itemClass="block opacity-90 hover:opacity-100"
          className="!gap-10"
        />
      </div>
    </nav>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}