import { useRouter } from 'next/navigation';
import { FC, ReactNode, useEffect, useState } from 'react';

interface ProtectedComponentProps {
    domain: string | string[];
  children: ReactNode;
}

const ProtectedComponent: FC<ProtectedComponentProps> = ({ domain, children }) => {
  const router = useRouter();
  const [isValidDomain, setIsValidDomain] = useState(false);  

  useEffect(() => {
    const checkDomain = async () => {
      try {
        const response = await fetch('/api/domains', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              domain,
            }),
          });
        const data = await response.json();

        if (data.status === 'success') {
          setIsValidDomain(true);
        } else {
          setIsValidDomain(false);
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to check domain:', error);
      }
    };

    checkDomain();
  }, [domain, router]);

  return isValidDomain ? <>{children}</> : null;
};

export default ProtectedComponent;