export function isValidSAIDNumber(idNumber: string): boolean {
    // Check if the ID number has 13 digits
    if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) {
      return false;
    }
  
    // Extract components from the ID number
    const dobAndGender = idNumber.substring(0, 10);
    const citizenshipCode = parseInt(idNumber.charAt(10), 10);
    const checksum = parseInt(idNumber.charAt(12), 10);
  
    // Validate date of birth and gender
    const year = parseInt(dobAndGender.substring(0, 2), 10);
    const month = parseInt(dobAndGender.substring(2, 4), 10);
    const day = parseInt(dobAndGender.substring(4, 6), 10);
  
    // Validate year of birth
    if (year < 0 || year > 99 || month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
  
    // Validate gender code
    const genderCode = parseInt(dobAndGender.substring(6, 10), 10);
    if (genderCode < 0 || genderCode > 9999) {
      return false;
    }
  
    // Validate citizenship code
    if (citizenshipCode !== 0) {
      return false;
    }
  
    // Validate checksum
    const calculatedChecksum = calculateChecksum(idNumber.substring(0, 12));
    if (checksum !== calculatedChecksum) {
      return false;
    }
  
    // If all checks pass, the ID number is valid
    return true;
  }
  
  function calculateChecksum(idBase: string): number {
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;
  
    for (let i = 0; i < weights.length; i++) {
      let digit = parseInt(idBase.charAt(i), 10) * weights[i];
      sum += digit > 9 ? digit - 9 : digit;
    }
  
    return (10 - (sum % 10)) % 10;
  }
  