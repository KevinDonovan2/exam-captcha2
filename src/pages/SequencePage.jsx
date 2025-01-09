import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY; 

const SequencePage = () => {
  const { n } = useParams();
  const [sequence, setSequence] = useState([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [captchaResolved, setCaptchaResolved] = useState(false);

  useEffect(() => {
    const loadCaptchaScript = () => {
      const script = document.createElement('script');
      script.src =
        'https://09bd26e5e726.eu-west-3.captcha-sdk.awswaf.com/09bd26e5e726/jsapi.js';
      script.type = 'text/javascript';
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    };

    if (typeof window !== 'undefined' && !scriptLoaded) {
      loadCaptchaScript();
    }
  }, [scriptLoaded]);

  useEffect(() => {
    if (scriptLoaded && window.AwsWafCaptcha) {
      window.showMyCaptcha = function () {
        const container = document.querySelector('#my-captcha-container');
        window.AwsWafCaptcha.renderCaptcha(container, {
          apiKey: API_KEY,
          onSuccess: () => {
            setCaptchaResolved(true);
          },
          onError: (error) => {
            console.error('Captcha Error:', error);
          },
        });
      };
    }
  }, [scriptLoaded]);

  useEffect(() => {
    const fetchSequence = async () => {
      const updatedSequence = [];
      for (let i = 1; i <= n; i++) {
        updatedSequence.push(`${i}. Pending...`);
        setSequence([...updatedSequence]);

        try {
          await axios.get('https://api.prod.jcloudify.com/whoami', {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
            },
          });
          updatedSequence[i - 1] = `${i}. Forbidden`;
        } catch (error) {
          if (error.response?.status === 403) {
            updatedSequence[i - 1] = `${i}. Captcha required`;

            if (!captchaResolved) {
              window.showMyCaptcha && window.showMyCaptcha();
              break;
            }
          } else if (error.response?.status === 405) {
            updatedSequence[i - 1] = `${i}. Method Not Allowed (405)`;
          } else {
            updatedSequence[i - 1] = `${i}. Error: ${error.message}`;
          }
        }

        setSequence([...updatedSequence]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    fetchSequence();
  }, [n, captchaResolved]);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Sequence</h1>
      <div className="sequence">
        {sequence.map((line, index) => (
          <p key={index} className="mb-2">
            {line}
          </p>
        ))}
      </div>
      <div id="my-captcha-container" />
    </div>
  );
};

export default SequencePage;
