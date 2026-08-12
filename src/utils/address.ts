export interface AddressFormData {
  label: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

export const EMPTY_ADDRESS_FORM: AddressFormData = {
  label: '',
  recipientName: '',
  phone: '',
  fullAddress: '',
  city: '',
  province: '',
  postalCode: '',
};

const PHONE_RE = /^[0-9+\-\s()]{8,20}$/;
const POSTAL_CODE_RE = /^\d{5}$/;

// Mirrors the backend Zod schema (BACKEND/src/modules/addresses/schema.ts).
export function validateAddressForm(form: AddressFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const recipientName = form.recipientName.trim();
  const phone = form.phone.trim();
  const fullAddress = form.fullAddress.trim();
  const city = form.city.trim();
  const province = form.province.trim();
  const postalCode = form.postalCode.trim();
  const label = form.label.trim();

  if (recipientName.length < 2) {
    errors.recipientName = 'Nama penerima minimal 2 karakter.';
  } else if (recipientName.length > 120) {
    errors.recipientName = 'Nama penerima maksimal 120 karakter.';
  }

  if (!PHONE_RE.test(phone)) {
    errors.phone = 'Format nomor HP tidak valid (8-20 digit, boleh +, -, spasi, kurung).';
  }

  if (fullAddress.length < 10) {
    errors.fullAddress = 'Alamat lengkap minimal 10 karakter.';
  } else if (fullAddress.length > 500) {
    errors.fullAddress = 'Alamat lengkap maksimal 500 karakter.';
  }

  if (city.length < 2) {
    errors.city = 'Kota minimal 2 karakter.';
  }

  if (province.length < 2) {
    errors.province = 'Provinsi minimal 2 karakter.';
  }

  if (!POSTAL_CODE_RE.test(postalCode)) {
    errors.postalCode = 'Kode pos harus 5 digit angka.';
  }

  if (label.length > 60) {
    errors.label = 'Label maksimal 60 karakter.';
  }

  return errors;
}
