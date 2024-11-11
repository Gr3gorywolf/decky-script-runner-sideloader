import { WifiOff, ArrowLeftRight } from 'lucide-react';

export const NotConnectedPlaceholder = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-950 text-gray-200">
      <div className="max-w-2xl p-8 text-center">
        <WifiOff className="mx-auto mb-8 w-24 h-24 text-gray-400" />
        <h1 className="text-3xl font-bold mb-4">Steam deck not connected</h1>
        <p className="text-xl mb-6">
          To use this feature, you need to enable sideloading mode on your Steam
          Deck.
        </p>
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <ol className="list-decimal list-inside text-left space-y-4">
            <li>Go to the  plugin's main menu</li>
            <li>
              Click the button with the transfer icon{' '}
              <ArrowLeftRight className="inline w-5 h-5 ml-2" />
            </li>
            <li>Click "Connect" button and enter your deck's ip</li>
          </ol>
        </div>
        <p className="text-gray-400">
          Once connected, all your script will appear here and you will be able to upload new ones or edit existing ones.
        </p>
      </div>
    </div>
  );
};
