"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'; // Correct path

const Nav = () => {
    const { data: session } = useSession();


    const [providers, setProviders] = useState(null)
    const [toggleDropdown, setToggleDropdown] = useState(false)

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response)
        }
        setUpProviders();


    }, [])
    return (
        <nav className="flex-between pt-3 mb-16 w-full">
            <Link href="/" className="flex gap-2 flex-center">
                <Image src="/assets/images/logo.jpg"
                    alt="ideanest logo"
                    width={30}
                    height={30}
                    className="object-contain rounded-full"
                />
                <p className="logo_text">IdeaNest</p>
            </Link>

            {/* Desktop navigation */}
            <div className="sm:flex hidden">
                {session?.user ? (
                    <div className="flex gap-3 md:gap-5">
                        <Link href="/create-prompt" className="black_btn">
                            Create Post
                        </Link>
                        <button type="button" onClick={signOut} className="outline_btn">
                            Sign out
                        </button>
                        <Link href="/profile"
                        >
                            <Image src={session?.user.image}
                                width={37}
                                height={37}
                                className="rounded-full"
                                alt="profile" /></Link>
                    </div>

                ) : (
                    <>
                        {providers && Object.values(providers).map((provider) => (
                            <button type="button"
                                key={provider.name}

                                onClick={() => signIn(provider.id)}
                                className="black_btn">
                                Sign In

                            </button>
                        ))}

                    </>
                )}
            </div>

            {/* mobile navigation */}
            <div className="sm:hidden flex relative">
                {session?.user ? (
                    <div className="flex">
                        <Image src={session?.user.image}
                            width={37}
                            height={37}
                            className="rounded-full"
                            alt="profile"
                            onClick={() => setToggleDropdown((prev) => !prev)} />

                        {toggleDropdown && (
                            <div className="dropdown">
                                <Link href="/profile"
                                    onClick={() => setToggleDropdown(false)}
                                    className="dropdown_link">
                                    My-profile

                                </Link>
                                <Link href="/create-prompt"
                                    onClick={() => setToggleDropdown(false)}
                                    className="dropdown_link">
                                    Create-Prompt

                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setToggleDropdown(false)
                                        signOut()
                                    }}
                                    className="mt-5 w-full black_btn">
                                    Sign Out

                                </button>

                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {providers && Object.values(providers).map((provider) => (
                            <button type="button"
                                key={provider.name}

                                onClick={() => signIn(provider.id)}
                                className="black_btn">
                                Sign In

                            </button>
                        ))}

                    </>
                )}
            </div>


        </nav>
    )
}

export default Nav