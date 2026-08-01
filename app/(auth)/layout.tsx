export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // `flex flex-col` so pages like signup (which use `flex-1 items-center
  // justify-center` on their root div) actually get a height to center within.
  return <div className="flex min-h-screen flex-col">{children}</div>;
}
