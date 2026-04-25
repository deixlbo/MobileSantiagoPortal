export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {children}
    </div>
  );
}
