// MINI PROJECT ON JS TOPICS: Consuming and creating Promises, Using Async/Await.

const getUser = function (id) {
  return new Promise((resolve, reject) => {
    if (id === 1) {
      resolve({ name: 'John', id: 1 });
    } else {
      reject('User not found');
    }
  });
};
const getOrder = function (userName) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ item: 'Laptop', price: 999, orderedBy: userName });
    }, 1500);
  });
};
const processPayment = function (userOrder) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userOrder < 1000) {
        resolve('Payment successful! ✅');
      } else {
        reject('Insufficient funds ❌');
      }
    }, 1000);
  });
};

const placeOrder = async function (userid) {
  try {
    const userData = await getUser(userid);
    const order = await getOrder(userData);
    const payment = await processPayment(order.price);
    console.log(`Order Placed by ${userData.name}\nItem:${order.item}\n${payment}`);
  } catch (error) {
    console.log(error);
  }
};
placeOrder(1);
placeOrder(5);
