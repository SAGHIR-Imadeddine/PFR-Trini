describe('Password Strength Utility', () => {
  // Password strength function (to be implemented in a utils file)
  const checkPasswordStrength = (password: string): number => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special character
    
    return Math.min(score, 5); // Max score of 5
  };

  it('returns low score for short passwords', () => {
    expect(checkPasswordStrength('abc')).toBeLessThan(3);
  });

  it('returns high score for strong passwords', () => {
    expect(checkPasswordStrength('StrongP@55word')).toBeGreaterThanOrEqual(4);
  });

  it('gives higher score to passwords with special characters', () => {
    const withoutSpecial = checkPasswordStrength('Password123');
    const withSpecial = checkPasswordStrength('Password123!');
    
    expect(withSpecial).toBeGreaterThan(withoutSpecial);
  });
}); 