import { RoomProvider } from '@/context/RoomContext';

const RoomLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <RoomProvider>{children}</RoomProvider>;
};

export default RoomLayout;
