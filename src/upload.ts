import FormData from 'form-data';
import fetch from 'node-fetch';
import ipfsPub from '../ipfs-pub.ignore';
import ipfsPriv from '../ipfs-priv.ignore';

export default (formData: FormData) => {
  const auth =
    'Basic ' + Buffer.from(ipfsPub + ':' + ipfsPriv).toString('base64');

  return fetch(`https://ipfs.infura.io:5001/api/v0/add`, {
    method: 'POST',
    // @ts-ignore
    body: formData,
    headers: {
      Authorization: auth,
    },
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res);
      }
    })
    .catch(e => {
      console.log(e);
    });
};
