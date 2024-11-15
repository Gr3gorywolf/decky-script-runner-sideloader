import { LucideSidebar, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { LAST_IP_KEY } from '@/Utils/constants';
import { useContext, useState, useEffect, FC } from 'react';
import { TestDeviceConnection } from '@/Utils/helpers';
import { EditorContext } from '@/Contexts/EditorContext';
import { useToast } from '@/Hooks/use-toast';
import { useScreenSize } from '@/Hooks/useScreenSize';

interface props {
  onSidebarTrigger: () => void;
}

export const TopBar: FC<props> = ({ onSidebarTrigger }) => {
  const { isDesktopOrLaptop } = useScreenSize();
  const { isConnected, setDeviceIp, setIsConnected, setEditingFile } =
    useContext(EditorContext);
  const [connecting, setConnecting] = useState(false);
   //when the sideloader is served from the steam deck, the SERVER_DECK_IP is set in the index.html
    //@ts-ignore
  const serverIp =  window.SERVER_DECK_IP ?? null
  const { toast } = useToast();

  const handleConnect = async (ip: string) => {
    setConnecting(true);
    const success = await TestDeviceConnection(ip);
    if (success) {
      setDeviceIp(ip);
      setIsConnected(true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.STEAM_DECK_IP = ip;
      localStorage.setItem(LAST_IP_KEY, ip);
    } else {
      toast({
        title: 'Failed to connect',
        description: 'Address not reachable',
        duration: 2000,
        variant: 'destructive',
      });
    }
    setConnecting(false);
  };

  const handleToggleConnection = async () => {
    if (isConnected) {
      setIsConnected(false);
      setDeviceIp(undefined);
      setTimeout(() => {
        setEditingFile(null);
      }, 1000);
    } else {
      let result = serverIp;
      if (!result) {
        result = prompt(
          "Enter your deck's IP address",
          localStorage.getItem(LAST_IP_KEY) ?? ''
        );
      }
      if (result) {
        await handleConnect(result);
      }
    }
  };

  useEffect(() => {
    // Check for deckIp in URL query parameters on component mount
    const urlParams = new URLSearchParams(window.location.search);
    const deckIp = urlParams.get('deckIp') ?? serverIp;
    if (deckIp) {
      handleConnect(deckIp); // Attempt to connect automatically if deckIp is provided in URL
    }
  }, [serverIp]); // Empty dependency array to run only on mount

  return (
    <div className="bg-gray-900 p-2 flex items-center justify-between">
      <div className="flex items-center">
        {!isDesktopOrLaptop && isConnected && (
          <div className='p-1 hover:bg-gray-800 rounded-md mr-4 ml-2'>
          <LucideSidebar
          size={18}
            onClick={onSidebarTrigger}
            className="cursor-pointer   "
          />
          </div>
        )}
        {isConnected ? (
          <Wifi className="h-5 w-5 text-green-500 mr-2" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-500 mr-2" />
        )}
        <span>{isConnected ? `Connected to Steam Deck` : 'Disconnected'}</span>
      </div>
      <Button
        onClick={handleToggleConnection}
        disabled={connecting}
        variant={isConnected ? 'destructive' : 'default'}
        size="sm"
      >
        {connecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
};
