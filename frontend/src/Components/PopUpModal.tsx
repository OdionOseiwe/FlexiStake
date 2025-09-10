import Button from '../Components/Button';
import { X } from 'lucide-react';

interface PopUpModalProps {
  PopUplabel: string;
  message?: string;
  setAmount: (amount: string) => void;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const PopUpModal: React.FC<PopUpModalProps> = ({
  PopUplabel,
  message,
  setAmount,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      className="
        p-4 absolute bottom-50 md:left-50 bg-zinc-300 rounded-2xl
      "
    >
      <p className="flex justify-end cursor-pointer">
        <button onClick={onClose}>
          <X className="cursor-pointer" />
        </button>
      </p>

      <form>
        <label className="text-l">Enter amount</label>
        <input
          className="flex justify-between items-center p-4 w-full h-16 brightness-125 mb-6 
            rounded-xl bg-white mt-1 text-black focus:border-none focus:outline-0 text-2xl"
          type="text"
          placeholder="0.0"
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex justify-end">
          <Button onClick={onConfirm} label={PopUplabel} />
        </div>

        <p className="text-l font-medium">
          {message || 'Are you sure you want to proceed with this action?'}
        </p>
      </form>
    </div>
  );
};

export default PopUpModal;
