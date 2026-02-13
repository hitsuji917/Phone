import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, CreditCard, Banknote } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

function WalletPage() {
  const navigate = useNavigate();
  const userProfile = useAppStore((state) => state.userProfile);
  const updateUserProfile = useAppStore((state) => state.updateUserProfile);
  
  const [showKeypad, setShowKeypad] = useState(false);
  const [actionType, setActionType] = useState<'charge' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNumberClick = (num: string) => {
    if (num === 'delete') {
      setAmount(amount.slice(0, -1));
    } else if (num === '.') {
      if (!amount.includes('.')) setAmount(amount + '.');
    } else {
      if (amount.includes('.') && amount.split('.')[1].length >= 2) return;
      setAmount(amount + num);
    }
  };

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (!val || isNaN(val)) return;

    if (actionType === 'charge') {
      updateUserProfile({ balance: userProfile.balance + val });
    } else {
      if (val > userProfile.balance) return; // Insufficient funds
      updateUserProfile({ balance: userProfile.balance - val });
    }

    setShowKeypad(false);
    setShowSuccess(true);
    setAmount('');
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#ededed]">
      {/* Header */}
      <header className="flex-none bg-[#ededed] h-12 flex items-center justify-between px-4 sticky top-0 z-10 pt-[env(safe-area-inset-top)]">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-900 flex items-center -ml-2 active:opacity-60 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-[16px]">返回</span>
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900">钱包</h1>
        <button className="text-gray-900 text-[16px] font-medium">
          账单
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {/* Balance Card */}
        <div className="bg-[#07c160] rounded-xl p-6 text-white shadow-sm mb-4">
          <div className="flex items-center gap-2 opacity-80 mb-2">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-medium">零钱余额</span>
          </div>
          <div className="text-4xl font-bold tracking-tight">
            ¥ {userProfile.balance.toFixed(2)}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <button 
            onClick={() => { setActionType('charge'); setShowKeypad(true); }}
            className="w-full flex items-center gap-4 px-5 py-4 active:bg-gray-50 border-b border-gray-100"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#07c160]">
              <Banknote className="w-6 h-6" />
            </div>
            <span className="text-[17px] text-gray-900 font-medium flex-1 text-left">充值</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
          <button 
             onClick={() => { setActionType('withdraw'); setShowKeypad(true); }}
            className="w-full flex items-center gap-4 px-5 py-4 active:bg-gray-50"
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-[#ffcc00]">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-[17px] text-gray-900 font-medium flex-1 text-left">提现</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </main>

      {/* Keypad Modal */}
      {showKeypad && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#f7f7f7] rounded-t-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
              <button onClick={() => setShowKeypad(false)}>
                <X className="w-6 h-6 text-gray-900" />
              </button>
              <h3 className="text-[17px] font-semibold text-gray-900">
                {actionType === 'charge' ? '充值金额' : '提现金额'}
              </h3>
              <div className="w-6"></div>
            </div>
            
            <div className="bg-white p-6 flex flex-col items-center border-b border-gray-100">
              <div className="text-3xl font-bold text-gray-900 flex items-baseline gap-1">
                <span className="text-2xl">¥</span>
                {amount || '0.00'}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-[1px] bg-gray-200">
              {[1, 2, 3].map(n => (
                <button key={n} onClick={() => handleNumberClick(n.toString())} className="col-span-1 bg-white py-5 text-2xl font-medium active:bg-gray-100">
                  {n}
                </button>
              ))}
              <button onClick={() => handleNumberClick('delete')} className="col-span-1 bg-white py-5 flex items-center justify-center active:bg-gray-100">
                <X className="w-6 h-6 text-gray-900" />
              </button>
              
              {[4, 5, 6].map(n => (
                <button key={n} onClick={() => handleNumberClick(n.toString())} className="col-span-1 bg-white py-5 text-2xl font-medium active:bg-gray-100">
                  {n}
                </button>
              ))}
              <button 
                onClick={handleSubmit}
                disabled={!amount || parseFloat(amount) === 0 || (actionType === 'withdraw' && parseFloat(amount) > userProfile.balance)}
                className={`col-span-1 row-span-3 flex items-center justify-center text-white text-[17px] font-medium transition-colors ${
                  !amount || parseFloat(amount) === 0 || (actionType === 'withdraw' && parseFloat(amount) > userProfile.balance)
                    ? 'bg-[#07c160]/50' 
                    : 'bg-[#07c160] active:bg-[#06ad56]'
                }`}
              >
                确定
              </button>

              {[7, 8, 9].map(n => (
                <button key={n} onClick={() => handleNumberClick(n.toString())} className="col-span-1 bg-white py-5 text-2xl font-medium active:bg-gray-100">
                  {n}
                </button>
              ))}

              <button className="col-span-1 bg-[#ededed] py-5"></button>
              <button onClick={() => handleNumberClick('0')} className="col-span-1 bg-white py-5 text-2xl font-medium active:bg-gray-100">
                0
              </button>
              <button onClick={() => handleNumberClick('.')} className="col-span-1 bg-white py-5 text-2xl font-medium active:bg-gray-100">
                .
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-[#07c160] rounded-full flex items-center justify-center text-white">
              <X className="w-6 h-6 rotate-45" style={{ transform: 'rotate(-45deg)' }} /> 
              {/* Using X rotated as checkmark hack or just fetch Check icon next time */}
            </div>
            <span className="text-[17px] font-medium text-gray-900">
              {actionType === 'charge' ? '充值成功' : '提现成功'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletPage;
