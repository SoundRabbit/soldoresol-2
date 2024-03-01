import { RoomView } from '@/component/_room/RoomView';

import { PageProvider } from '../../PageProvider';

type PageProps = {
  params: {
    roomId: string;
  };
};

const Page = ({ params: { roomId } }: PageProps) => {
  return (
    <PageProvider roomId={roomId}>
      <RoomView />
    </PageProvider>
  );
};

export default Page;
