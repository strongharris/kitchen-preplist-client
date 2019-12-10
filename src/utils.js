import { format, isTomorrow, isToday } from 'date-fns/esm';
export const convertDateFormat= (date) => {
  return format(date, 'MM/dd/yy');
}

export const dateMatched = (date) => {
  console.log(date,"incoming")
  if (isTomorrow(date) || isToday(date)) {
    return true;
  } else {
    return false;
  }
}

export const postData = (url, data = {}) => {
  return fetch(url, {
    method: "POST",
    mode: "cors", 
    cache: "no-cache", 
    credentials: "omit",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow", 
    referrer: "no-referrer",
    body: JSON.stringify(data) 
  });
};

export const putData = (url, data = {}) => {
  return fetch(url, {
    method: "PUT",
    mode: "cors", 
    cache: "no-cache", 
    credentials: "omit",    
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow", 
    referrer: "no-referrer",
    body: JSON.stringify(data) 
  });
};

export const deleteData = (url, data = {}) => {
  return fetch(url, {
    method: "DELETE",
    mode: "cors", 
    cache: "no-cache", 
    credentials: "omit",    
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow", 
    referrer: "no-referrer",
    body: JSON.stringify(data) 
  });
};

export const dcf = (num) => {
  const numStr = num.toString();
  let whole = '';
  let rational = '';
  let fraction = '';
  let wholeCompleted = false;
  if (numStr === '0') {
    return '0';
  }
  for (let i = numStr[0] === '0' ? 1 : 0; i < numStr.length; i++) {
    let char = numStr[i];
    if (char === '.') {
      wholeCompleted = true;
      rational += char;
    } else if (wholeCompleted) {
      rational += char;
    } else {
      whole += char;
    }    
  }
  if (rational === '.25') {
    fraction = '1/4'
  } else if (rational === '.5') {
    fraction = '1/2'
  } else if (rational === '.75') {
    fraction = '3/4'
  } else {
    fraction = ''
  }
  return whole + ' ' + fraction;
}

// export const scf = (numStr) => {
//   let whole = '';
//   let rational = '';
//   let fraction = '';
//   let wholeCompleted = false;
//   if (numStr === '0') {
//     return '0';
//   }
//   for (let i = numStr[0] === '0' ? 1 : 0; i < numStr.length; i++) {
//     let char = numStr[i];
//     if (char === '.') {
//       wholeCompleted = true;
//       rational += char;
//     } else if (wholeCompleted) {
//       rational += char;
//     } else {
//       whole += char;
//     }    
//   }
//   if (rational === '.25') {
//     fraction = '1/4'
//   } else if (rational === '.5') {
//     fraction = '1/2'
//   } else if (rational === '.75') {
//     fraction = '3/4'
//   } else {
//     fraction = ''
//   }
//   return whole + ' ' + fraction;
// }

