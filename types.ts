
export interface MotorcycleRecord {
  id: string;
  photoUrl: string;
  // Details from Shop Purchase
  purchaseDate: string;
  brand: string;
  type: string;
  yearModel: string;
  regDate: string;
  plateNumber: string;
  province: string;
  color: string;
  chassisNo: string;
  chassisLocation: string;
  engineBrand: string;
  engineNo: string;
  cylinders: string;
  cc: string;
  // Original Owner Info
  originalOwnerName: string;
  originalOwnerId: string;
  originalOwnerBirthday: string;
  originalOwnerNationality: string;
  originalOwnerAddress: string;
  // Sales Details
  bookNo: string;
  salesNo: string;
  saleDate: string;
  buyerName: string;
  buyerAddress: string;
  salePrice: string;
  transferType: 'โอนเอง' | 'โอนให้' | '';
  transferDetails: string;
  receivedBookDate: string;
  createdAt: number;
}
