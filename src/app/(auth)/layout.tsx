import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  

  return (
    <main className="bg-neutral-100 h-screen">
      <nav className="bg-white">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        </div>
      </nav>
      <section className="container mx-auto">
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </section>
    </main>
  );
}
