
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, BookOpen, User, DollarSign, MapPin, Phone, Trash2, Edit3, Camera, X, Save, ArrowRight, ArrowLeft } from 'lucide-react';
import { MotorcycleRecord } from './types';
import { InputGroup } from './components/InputGroup';

const INITIAL_RECORD: MotorcycleRecord = {
  id: '',
  photoUrl: '',
  purchaseDate: '',
  brand: '',
  type: '',
  yearModel: '',
  regDate: '',
  plateNumber: '',
  province: '',
  color: '',
  chassisNo: '',
  chassisLocation: '',
  engineBrand: '',
  engineNo: '',
  cylinders: '',
  cc: '',
  originalOwnerName: '',
  originalOwnerId: '',
  originalOwnerBirthday: '',
  originalOwnerNationality: '',
  originalOwnerAddress: '',
  bookNo: '',
  salesNo: '',
  saleDate: '',
  buyerName: '',
  buyerAddress: '',
  salePrice: '',
  transferType: '',
  transferDetails: '',
  receivedBookDate: '',
  createdAt: Date.now()
};

export default function App() {
  const [records, setRecords] = useState<MotorcycleRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MotorcycleRecord | null>(null);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('tong_motor_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }
  }, []);

  // Save data
  const saveRecords = (newRecords: MotorcycleRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('tong_motor_records', JSON.stringify(newRecords));
  };

  const handleAddNew = () => {
    setEditingRecord({ ...INITIAL_RECORD, id: Date.now().toString() });
    setIsFormOpen(true);
  };

  const handleEdit = (record: MotorcycleRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    // 1. ถามยืนยันก่อนลบ
    const isConfirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลรถคันนี้?');
    
    if (isConfirmed) {
      // 2. ใช้ Functional Update เพื่อเลี่ยงปัญหาข้อมูลไม่อัปเดต
      setRecords(prevRecords => {
        const filtered = prevRecords.filter(r => r.id !== id);
        
        // 3. บันทึกลง LocalStorage ทันทีด้วยค่าใหม่
        localStorage.setItem('tong_motor_records', JSON.stringify(filtered));
        
        return filtered;
      });
    }
  };
  

  const handleSaveForm = (record: MotorcycleRecord) => {
    const exists = records.find(r => r.id === record.id);
    let newRecords;
    if (exists) {
      newRecords = records.map(r => r.id === record.id ? record : r);
    } else {
      newRecords = [record, ...records];
    }
    saveRecords(newRecords);
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const filteredRecords = records.filter(r => 
    r.plateNumber.includes(searchTerm) || 
    r.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.originalOwnerName.includes(searchTerm)
  );

  const soldCars = records.filter(r => r.buyerName && r.buyerName.trim() !== '').length;
  const availableCars = records.length - soldCars;
   
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-green-800 text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold header-font">ร้านตงมอเตอร์</h1>
            <p className="text-lg opacity-90">ตงมอเตอร์ ยะลา โทร. 073-214391</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/90 p-5 rounded-full px-10 w-full md:w-2/3 shadow-sm border border-black/10">
  {/* ปรับขนาดไอคอน Search ให้ใหญ่ขึ้นเป็น 48 */}
  <Search className="text-black/70" size={48} strokeWidth={2.5} />
  
  <input 
    type="text" 
    placeholder="ค้นหา ทะเบียน, ยี่ห้อ, ชื่อเจ้าของ..." 
    className="bg-transparent border-none outline-none !text-4xl font-medium text-black placeholder-black/50 w-full leading-relaxed"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
        </div>
      </header>

      {/* Stats / Quick Info */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/30 flex justify-between items-center">
          <div>
            <p className="text-black font-bold text-2xl">รถในร้านทั้งหมด</p>
            <p className="text-6xl font-bold text-blue-800">{records.length} คัน</p>
          </div>
          <div>
            <p className="text-black  font-bold text-2xl">รถที่พร้อมขาย</p>
            <p className="text-6xl font-bold text-green-800">{availableCars} คัน</p>
          </div>
           <div>
            <p className="text-black font-bold text-2xl">รถที่ขายแล้ว</p>
            <p className="text-6xl font-bold text-red-800">{soldCars} คัน</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl transition-transform active:scale-95 text-2xl"
          >
            <Plus size={64} strokeWidth={3} />  
                <span className="text-6xl font-black tracking-wide"> เพิ่มรถใหม่</span>
          </button>
        </div>
      </div>

      {/* Record Grid */}
      <main className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 group">
            {/* Vehicle Image */}
            <div className="h-64 bg-gray-200 relative">
              {record.photoUrl ? (
                <img src={record.photoUrl} alt="รถ" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Camera size={48} />
                  <p className="mt-2 text-lg">ไม่มีรูปรถ</p>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => handleEdit(record)}
                  className="bg-white/90 p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50"
                >
                  <Edit3 size={24} />
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // กันไม่ให้ไปกดโดนส่วนเปิด Modal แก้ไข
                    handleDelete(record.id);
                  }}                 
                  className="bg-white/90 p-3 rounded-full shadow-lg text-red-600 hover:bg-red-50 z-20"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>

            {/* Green Book Visual Button */}
            <button 
              onClick={() => handleEdit(record)}
              className="w-full text-left"
            >
              <div className="bg-green-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={28} />
                  <span className="text-xl font-bold">เล่มทะเบียน (กดดู/แก้ไข)</span>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">ทะเบียน</p>
                  <p className="text-xl font-bold">{record.plateNumber || '---'}</p>
                </div>
              </div>
              
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500">ยี่ห้อ:</span>
                  <span className="text-gray-700 font-bold">{record.brand || '-'} ({record.yearModel || '-'})</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-500">เจ้าของเดิม:</span>
                  <span className="font-semibold text-gray-700">{record.originalOwnerName || '-'}</span>
                </div>
                {record.buyerName && (
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 text-lg">
                    <p className="text-green-700 font-bold">ขายแล้วให้: {record.buyerName}</p>
                    <p className="text-gray-500 text-base">ราคา: {record.salePrice} บาท</p>
                  </div>
                )}
              </div>
            </button>
          </div>
        ))}
      </main>

      {/* empty state */}
      {filteredRecords.length === 0 && (
        <div className="text-center mt-20 text-gray-400 px-4">
          <BookOpen size={100} className="mx-auto opacity-20" />
          <p className="text-2xl mt-4">ยังไม่มีข้อมูลรถที่ค้นหา</p>
        </div>
      )}
      

      {/* Modal with Pages */}
      {isFormOpen && editingRecord && (
        <GreenBookModal 
          record={editingRecord} 
          onClose={() => setIsFormOpen(false)} 
          onSave={handleSaveForm}
        />
      )}
    </div>
  );
}

interface ModalProps {
  record: MotorcycleRecord;
  onClose: () => void;
  onSave: (record: MotorcycleRecord) => void;
}

const GreenBookModal: React.FC<ModalProps> = ({ record, onClose, onSave }) => {
  const [formData, setFormData] = useState<MotorcycleRecord>(record);
  const [activeTab, setActiveTab] = useState(1); // 1: Vehicle, 2: Owner, 3: Sales

  const updateField = (field: keyof MotorcycleRecord, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 1, label: '๑. ข้อมูลรถ', color: 'bg-green-700', activeColor: 'ring-4 ring-green-300' },
    { id: 2, label: '๒. เจ้าของเดิม', color: 'bg-orange-600', activeColor: 'ring-4 ring-orange-300' },
    { id: 3, label: '๓. ข้อมูลการขาย', color: 'bg-blue-700', activeColor: 'ring-4 ring-blue-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="bg-gray-800 text-white p-5 flex justify-between items-center rounded-t-3xl">
          <div className="flex items-center gap-4">
            <BookOpen size={32} />
            <h2 className="text-3xl font-bold">เล่มทะเบียน: {formData.plateNumber || 'คันใหม่'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={36} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 p-4 gap-2 bg-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 rounded-xl text-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? `${tab.color} text-white shadow-lg scale-105 ${tab.activeColor}` 
                  : 'bg-white text-gray-500 border border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          
          {/* PAGE 1: VEHICLE INFO */}
          {activeTab === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-300">
              <section className="bg-green-50 p-6 rounded-3xl border-2 border-green-100">
                <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                  <Camera /> รูปถ่ายรถ
                </h3>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-64 h-64 bg-white rounded-2xl overflow-hidden flex items-center justify-center border-4 border-white shadow-xl relative group">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="รถ" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={64} className="text-gray-800" />
                    )}
                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                      <span className="bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg text-lg">เปลี่ยนรูป</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-3xl text-gray-700 font-medium">ภาพหลักของรถคันนี้</p>
                    <p className="text-2xl text-gray-500 mb-4">ถ่ายรูปรถให้ชัดเจนเพื่อความสะดวกในการค้นหา</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="text-3xl cursor-pointer" 
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputGroup label="วันที่ซื้อ" type="date" value={formData.purchaseDate} onChange={v => updateField('purchaseDate', v)} />
                <InputGroup label="ยี่ห้อรถ" value={formData.brand} onChange={v => updateField('brand', v)} placeholder="เช่น HONDA" />
                <InputGroup label="แบบ" value={formData.type} onChange={v => updateField('type', v)} placeholder="เช่น รถจักรยานยนต์" />
                <InputGroup label="รุ่นปี ค.ศ." value={formData.yearModel} onChange={v => updateField('yearModel', v)} placeholder="เช่น 2023" />
                <InputGroup label="วันจดทะเบียน" type="date" value={formData.regDate} onChange={v => updateField('regDate', v)} />
                <InputGroup label="เลขทะเบียน" value={formData.plateNumber} onChange={v => updateField('plateNumber', v)} placeholder="1กข 1234" />
                <InputGroup label="จังหวัด" value={formData.province} onChange={v => updateField('province', v)} placeholder="ยะลา" />
                <InputGroup label="สี" value={formData.color} onChange={v => updateField('color', v)} placeholder="ขาว-แดง" />
                <InputGroup label="เลขตัวรถ" value={formData.chassisNo} onChange={v => updateField('chassisNo', v)} />
                <InputGroup label="อยู่ที่" value={formData.chassisLocation} onChange={v => updateField('chassisLocation', v)} />
                <InputGroup label="ยี่ห้อเครื่องยนต์" value={formData.engineBrand} onChange={v => updateField('engineBrand', v)} />
                <InputGroup label="เลขเครื่องยนต์" value={formData.engineNo} onChange={v => updateField('engineNo', v)} />
                <InputGroup label="จำนวนสูบ" value={formData.cylinders} onChange={v => updateField('cylinders', v)} />
                <InputGroup label="ซีซี (CC)" value={formData.cc} onChange={v => updateField('cc', v)} />
              </section>
            </div>
          )}

          {/* PAGE 2: ORIGINAL OWNER */}
          {activeTab === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-100 mb-6">
                <h3 className="text-2xl font-bold text-orange-800 flex items-center gap-2">
                  <User /> ข้อมูลเจ้าของเดิม (ผู้ขายให้ร้าน)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="ชื่อเจ้าของรถเดิม" value={formData.originalOwnerName} onChange={v => updateField('originalOwnerName', v)} />
                <InputGroup label="เลขที่บัตรประชาชน" value={formData.originalOwnerId} onChange={v => updateField('originalOwnerId', v)} />
                <InputGroup label="วันเกิด" type="date" value={formData.originalOwnerBirthday} onChange={v => updateField('originalOwnerBirthday', v)} />
                <InputGroup label="สัญชาติ" value={formData.originalOwnerNationality} onChange={v => updateField('originalOwnerNationality', v)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 font-semibold text-3xl">ที่อยู่ตามบัตรประชาชน</label>
                <textarea 
                  value={formData.originalOwnerAddress} 
                  onChange={e => updateField('originalOwnerAddress', e.target.value)}
                  className="border-2 border-gray-300 rounded-2xl p-4 text-2xl h-40 focus:border-blue-600 outline-none shadow-sm"
                  placeholder="บ้านเลขที่, หมู่บ้าน, ถนน, ตำบล, อำเภอ, จังหวัด"
                />
              </div>
            </div>
          )}

          {/* PAGE 3: SALES DETAILS */}
          {activeTab === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-200 shadow-sm text-center">
                <p className="text-2xl font-bold text-blue-900">สัญญาจะซื้อ จะขายรถจักรยานยนต์</p>
                <p className="text-4xl font-bold text-blue-800 mt-2 underline">ร้านตงมอเตอร์</p>
                <p className="text-lg mt-2 text-blue-700">โทร 073-214391</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="เล่มที่" value={formData.bookNo} onChange={v => updateField('bookNo', v)} />
                <InputGroup label="เลขที่สัญญา" value={formData.salesNo} onChange={v => updateField('salesNo', v)} />
                <InputGroup label="วันที่ขาย" type="date" value={formData.saleDate} onChange={v => updateField('saleDate', v)} />
                <InputGroup label="ราคาขาย (บาท)" type="number" value={formData.salePrice} onChange={v => updateField('salePrice', v)} placeholder="0.00" />
                <InputGroup label="ชื่อผู้ซื้อใหม่" value={formData.buyerName} onChange={v => updateField('buyerName', v)} />
                <div className="flex flex-col gap-1">
                  <label className="text-gray-700 font-semibold text-xl">ที่อยู่ผู้ซื้อใหม่</label>
                  <textarea 
                    value={formData.buyerAddress} 
                    onChange={e => updateField('buyerAddress', e.target.value)}
                    className="border-2 border-gray-300 rounded-2xl p-4 text-2xl h-32 focus:border-orange-600 outline-none shadow-sm"
                  />
                </div>
              </div>

              <div className="mt-6 p-8 bg-white rounded-3xl border-2 border-blue-100 shadow-sm">
                <h4 className="text-3xl font-bold text-blue-900 mb-6">ข้อมูลการโอนทะเบียน</h4>
                <div className="flex gap-12 mb-8">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="transferType" 
                      className="w-10 h-10 accent-blue-600 cursor-pointer"
                      checked={formData.transferType === 'โอนเอง'}
                      onChange={() => updateField('transferType', 'โอนเอง')}
                    />
                    <span className="text-3xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">โอนเอง</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="transferType" 
                      className="w-10 h-10 accent-blue-600 cursor-pointer"
                      checked={formData.transferType === 'โอนให้'}
                      onChange={() => updateField('transferType', 'โอนให้')}
                    />
                    <span className="text-3xl font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">ร้านโอนให้</span>
                  </label>
                </div>

                {formData.transferType === 'โอนให้' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-200">
                    <InputGroup label="รายละเอียดการโอน" value={formData.transferDetails} onChange={v => updateField('transferDetails', v)} placeholder="เช่น ยื่นเอกสารแล้ว" />
                    <InputGroup label="วันที่ได้รับเล่มคืน" type="date" value={formData.receivedBookDate} onChange={v => updateField('receivedBookDate', v)} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200 rounded-b-3xl flex flex-col md:flex-row gap-4">
          <div className="flex gap-4 flex-1">
            {activeTab > 1 && (
              <button 
                onClick={() => setActiveTab(prev => prev - 1)}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-bold py-5 rounded-2xl text-2xl flex items-center justify-center gap-2"
              >
                <ArrowLeft size={28} /> ย้อนกลับ
              </button>
            )}
            {activeTab < 3 ? (
              <button 
                onClick={() => setActiveTab(prev => prev + 1)}
                className="flex-1 bg-gray-800 text-white font-bold py-5 rounded-2xl text-2xl flex items-center justify-center gap-2"
              >
                หน้าถัดไป <ArrowRight size={28} />
              </button>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>
          
          <button 
            onClick={() => onSave(formData)}
            className="flex-[1.5] bg-green-700 hover:bg-green-800 text-white font-bold py-5 rounded-2xl text-3xl flex items-center justify-center gap-4 shadow-xl transition-all active:scale-95"
          >
            <Save size={36} /> บันทึกเล่มนี้
          </button>
        </div>
      </div>
    </div>
  );
};

