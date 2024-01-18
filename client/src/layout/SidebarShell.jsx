import { Fragment, useEffect, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { useAuth } from '../context/auth-context.jsx';
import { getAllChats, pinChatById } from '../api/chat.js';
import BlackLogo from '../assets/black_transparent.png';
import { Link } from 'react-router-dom';
import AdvancedOptions from '../components/chat/AdvancedOptions.jsx';
import SlideOut from './SlideOut.jsx';
import pinSVG from '../assets/pin.svg';
import { Bars3Icon, AdjustmentsVerticalIcon, Cog6ToothIcon, XMarkIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/20/solid';

const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
];
const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function SidebarShell({ children, ...props }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [slideOutOpen, setSlideOutOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const [navigation, setNavigation] = useState();
    const [loading, setLoading] = useState(true);
    const [pinnedChats, setPinnedChats] = useState([]);

    useEffect(() => {
        getAllChats(currentUser).then((res) => {
            if (res.error) {
                logout();
                return;
            }
            setLoading(false);
            const updatedNavigation = [
                ...res.chats.map((chat) => ({
                    name: chat.title || 'New Chat', // Fallback to 'Chat' if title is not available
                    href: `/chat/${chat.id}`,
                    icon: null,
                    current: false,
                    id: chat.id,
                    pinned: chat.pinned,
                })),
            ];
            setNavigation(updatedNavigation);
            const pinnedChatsArray = res.chats.filter((chat) => chat.pinned);
            const updatedPinnedChats = pinnedChatsArray.map((chat) => ({
                name: chat.title || 'New Chat', // Fallback to 'Chat' if title is not available
                href: `/chat/${chat.id}`,
                icon: null,
                current: false,
                id: chat.id,
                pinned: chat.pinned,
            }));
            setPinnedChats(updatedPinnedChats);
        });
    }, []);

    const handlePinItem = (item) => {
        item.pinned = !item.pinned;
        console.log(item);

        let updatedPinnedChats;
        let updatedNavigation;

        if (item.pinned) {
            // Add to pinned chats
            updatedPinnedChats = [...pinnedChats, item];
            // Remove from main navigation
            updatedNavigation = navigation.filter((chatItem) => chatItem.id !== item.id);
        } else {
            // Remove from pinned chats
            updatedPinnedChats = pinnedChats.filter((chatItem) => chatItem.id !== item.id);
            // Add back to main navigation
            updatedNavigation = [...navigation, item];
        }

        setPinnedChats(updatedPinnedChats);
        setNavigation(updatedNavigation);
        pinChatById(item.id, currentUser, item.pinned); // Added item.pinned to indicate the pinning status
    };

    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as='div' className='relative z-50 lg:hidden' onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter='transition-opacity ease-linear duration-300'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='transition-opacity ease-linear duration-300'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <div className='fixed inset-0 bg-gray-900/80' />
                        </Transition.Child>

                        <div className='fixed inset-0 flex'>
                            <Transition.Child
                                as={Fragment}
                                enter='transition ease-in-out duration-300 transform'
                                enterFrom='-translate-x-full'
                                enterTo='translate-x-0'
                                leave='transition ease-in-out duration-300 transform'
                                leaveFrom='translate-x-0'
                                leaveTo='-translate-x-full'
                            >
                                <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                                    <Transition.Child
                                        as={Fragment}
                                        enter='ease-in-out duration-300'
                                        enterFrom='opacity-0'
                                        enterTo='opacity-100'
                                        leave='ease-in-out duration-300'
                                        leaveFrom='opacity-100'
                                        leaveTo='opacity-0'
                                    >
                                        <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                                            <button
                                                type='button'
                                                className='-m-2.5 p-2.5'
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className='sr-only'>Close sidebar</span>
                                                <XMarkIcon className='h-6 w-6 text-white' aria-hidden='true' />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4'>
                                        <div className='flex h-16 shrink-0 items-center'>
                                            <img className='h-8 w-auto' src={BlackLogo} alt='Your Company' />
                                            <h1 className='text-black'>PowerGPT</h1>
                                        </div>
                                        <nav className='flex flex-1 flex-col'>
                                            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                                                <li>
                                                    <ul role='list' className='-mx-2 space-y-1'>
                                                        {navigation &&
                                                            navigation.map((item, index) => (
                                                                <li key={index}>
                                                                    <Link
                                                                        to={item.href}
                                                                        className={classNames(
                                                                            item.current
                                                                                ? 'bg-gray-50 text-indigo-600'
                                                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                        )}
                                                                    >
                                                                        {item.icon && (
                                                                            <item.icon
                                                                                className={classNames(
                                                                                    item.current
                                                                                        ? 'text-indigo-600'
                                                                                        : 'text-gray-400 group-hover:text-indigo-600',
                                                                                    'h-6 w-6 shrink-0'
                                                                                )}
                                                                                aria-hidden='true'
                                                                            />
                                                                        )}
                                                                        {item.name ? item.name : 'loading'}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        {!loading && <li className=''>loading</li>}
                                                    </ul>
                                                </li>
                                                <li className='mt-auto'>
                                                    <a
                                                        href='#'
                                                        className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                                    >
                                                        <Cog6ToothIcon
                                                            className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                                                            aria-hidden='true'
                                                        />
                                                        Settings
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col '>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4'>
                        <div className='flex h-16 shrink-0 items-center'>
                            <img className='h-12 w-auto' src={BlackLogo} alt='Your Company' />
                            <h1 className='text-black p-2 font-bold text-2xl'>PowerGPT</h1>
                        </div>
                        <nav className='flex flex-1 -mt-3 flex-col'>
                            <ul role='list' className='-mx-2 space-y-1 mb-4'>
                                <li>
                                    <Link
                                        to='/'
                                        className='text-gray-700 hover:text-yellow-500 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                    >
                                        <PlusIcon
                                            className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-yellow-500'
                                            aria-hidden='true'
                                        />

                                        {'Create a New Chat'}
                                    </Link>
                                </li>
                                <hr />
                            </ul>
                            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                                {pinnedChats.length > 0 && (
                                    <li>
                                        <div className='text-xs font-semibold leading-6 text-gray-400'>Pinned Chats</div>
                                        <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                            {pinnedChats.map((chat) => (
                                                <Fragment key={chat.id}>
                                                    <div>
                                                        <li className='flex flex-row items-center justify-between p-1'>
                                                            <Link
                                                                to={`/chat/${chat.id}`}
                                                                className={classNames(
                                                                    chat.current
                                                                        ? 'bg-gray-50 text-indigo-600'
                                                                        : 'text-gray-700 hover:text-yellow-600 hover:bg-gray-50',
                                                                    'group flex gap-x-3 rounded-md p-2 text-xs leading-6 font-semibold w-full'
                                                                )}
                                                            >
                                                                <span className='truncate'>{chat.name}</span>
                                                            </Link>
                                                            <XMarkIcon
                                                                onClick={() => handlePinItem(chat)}
                                                                className='h-5 w-5 shrink-0 text-gray-400 hover:text-red-500 cursor-pointer'
                                                            />
                                                        </li>
                                                    </div>
                                                    <hr />
                                                </Fragment>
                                            ))}
                                        </ul>
                                    </li>
                                )}
                                <li>
                                    <ul role='list' className='-mx-2 space-y-1'>
                                        <div className='text-xs font-semibold leading-6 text-gray-400 pl-2'>All Chats</div>
                                        {navigation &&
                                            navigation.map((item, index) => (
                                                <li key={index}>
                                                    <div className='flex flex-row items-center justify-between p-1'>
                                                        <Link
                                                            to={item.href}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-gray-50 text-yellow-500'
                                                                    : 'text-gray-700 hover:text-yellow-500 hover:bg-gray-50',
                                                                'group flex gap-x-3 rounded-md p-2 text-xs leading-6 font-semibold w-full'
                                                            )}
                                                        >
                                                            {item.icon && (
                                                                <item.icon
                                                                    className={classNames(
                                                                        item.current
                                                                            ? 'text-yellow-500'
                                                                            : 'text-gray-400 group-hover:text-yellow-500',
                                                                        'h-6 w-6 shrink-0'
                                                                    )}
                                                                    aria-hidden='true'
                                                                />
                                                            )}
                                                            {item.name
                                                                ? item.name.length > 30
                                                                    ? item.name.slice(0, 30) + '...'
                                                                    : item.name
                                                                : 'New Chat'}
                                                        </Link>
                                                        {!item.pinned && (
                                                            // <EllipsisHorizontalIcon
                                                            //     onClick={() => handlePinItem(item)}
                                                            //     className='h-6 w-6 shrink-0 text-gray-400 hover:text-yellow-500 cursor-pointer'
                                                            // />
                                                            <img
                                                                src={pinSVG}
                                                                alt='pin'
                                                                onClick={() => handlePinItem(item)}
                                                                className='h-5 w-5 shrink-0 text-gray-400 hover:text-yellow-500 cursor-pointer opacity-30 hover:opacity-80'
                                                            />
                                                        )}
                                                    </div>
                                                    <hr />
                                                </li>
                                            ))}
                                    </ul>
                                </li>

                                <li className='mt-auto'>
                                    <a
                                        href='#'
                                        className='group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                    >
                                        <Cog6ToothIcon
                                            className='h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                                            aria-hidden='true'
                                        />
                                        Settings
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className='lg:pl-72 '>
                    <div className='sticky top-0 z-40 lg:mx-auto '>
                        <div className='flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none'>
                            <button
                                type='button'
                                className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className='sr-only'>Open sidebar</span>
                                <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                            </button>

                            {/* Separator */}
                            <div className='h-6 w-px bg-gray-200 lg:hidden' aria-hidden='true' />

                            <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6 px-4'>
                                <form className='relative flex flex-1' action='#' method='GET'>
                                    <label htmlFor='search-field' className='sr-only'>
                                        Search
                                    </label>
                                    <MagnifyingGlassIcon
                                        className='pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400'
                                        aria-hidden='true'
                                    />
                                    <input
                                        id='search-field'
                                        className='block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm'
                                        placeholder='Search...'
                                        type='text'
                                        name='text'
                                    />
                                </form>
                                <div className='flex items-center gap-x-4 lg:gap-x-6'>
                                    <button type='button' className='-m-2.5 p-2.5 text-gray-400 hover:text-gray-500'>
                                        <span className='sr-only'>View notifications</span>
                                        <AdjustmentsVerticalIcon
                                            onClick={() => {
                                                setSlideOutOpen(!slideOutOpen);
                                            }}
                                            className='h-7 w-7 cursor-pointer z-40'
                                            aria-hidden='true'
                                        />
                                    </button>

                                    {/* Separator */}
                                    <div className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200' aria-hidden='true' />

                                    {/* Profile dropdown */}
                                    <Menu as='div' className='relative'>
                                        <Menu.Button className='-m-1.5 flex items-center p-1.5'>
                                            <span className='sr-only'>Open user menu</span>
                                            {/* <img
                                                className='h-8 w-8 rounded-full bg-gray-50'
                                                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                                alt=''
                                            /> */}
                                            <span className='hidden lg:flex lg:items-center'>
                                                <span
                                                    className='-ml-1 text-sm font-semibold leading-6 text-gray-900'
                                                    aria-hidden='true'
                                                >
                                                    {currentUser?.username}
                                                </span>
                                                <ChevronDownIcon className='ml-2 h-5 w-5 text-gray-400' aria-hidden='true' />
                                            </span>
                                            <Cog8ToothIcon
                                                className='ml-2 h-6 w-6 text-gray-400 md:hidden'
                                                aria-hidden='true'
                                            />
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter='transition ease-out duration-100'
                                            enterFrom='transform opacity-0 scale-95'
                                            enterTo='transform opacity-100 scale-100'
                                            leave='transition ease-in duration-75'
                                            leaveFrom='transform opacity-100 scale-100'
                                            leaveTo='transform opacity-0 scale-95'
                                        >
                                            <Menu.Items className='absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                                                {userNavigation.map((item) => (
                                                    <Menu.Item key={item.name}>
                                                        {({ active }) => (
                                                            <div
                                                                onClick={() => {
                                                                    if (item.name === 'Sign out') logout();
                                                                }}
                                                                className={classNames(
                                                                    active ? 'bg-gray-50' : '',
                                                                    'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer'
                                                                )}
                                                            >
                                                                {item.name}
                                                            </div>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className=''>
                        <SlideOut
                            open={slideOutOpen}
                            setOpen={setSlideOutOpen}
                            settings={props.settings}
                            setSettings={props.setSettings}
                            title='Advanced Settings'
                        >
                            <AdvancedOptions settings={props.settings} setSettings={props.setSettings} />
                        </SlideOut>
                        <div className='px-4 py-2'>{children}</div>
                    </main>
                </div>
            </div>
        </>
    );
}
