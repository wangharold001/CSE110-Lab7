describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO. 
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return item.data;
      });
    });

    console.log(`Checking product item 1/${prodItemsData.length}`);

    // Make sure the title, price, and image are populated in the JSON
    const firstValue = prodItemsData[0];
    if (firstValue.title.length == 0) { allArePopulated = false; }
    if (firstValue.price.length == 0) { allArePopulated = false; }
    if (firstValue.image.length == 0) { allArePopulated = false; }
    /**
    **** TODO - STEP 1 ****
    * Right now this function is only checking the first <product-item> it found, make it so that
      it checks every <product-item> it found.
    * Remove the .skip from this it once you are finished writing this test.
    */
   for (let i = 1; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
      const value = prodItemsData[i];
      if (value.title.length == 0) { allArePopulated = false; }
      if (value.price.length == 0) { allArePopulated = false; }
      if (value.image.length == 0) { allArePopulated = false; }
    }
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    /**
     **** TODO - STEP 2 **** 
     * Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
     * Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
     * Once you have the button, you can click it and check the innerText property of the button.
     * Once you have the innerText property, use innerText.jsonValue() to get the text value of it
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
    const firstItem = await page.$('product-item');
    const shadowButton = await firstItem.evaluateHandle(el =>
      el.shadowRoot.querySelector('button')
    );                                       // reach into Shadow DOM
    await shadowButton.click();              // click it
    const txt = await shadowButton.getProperty('innerText');
    expect(await txt.jsonValue()).toBe('Remove from Cart');
  }, 10000);
  

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
/***** STEP 3 *****/
it('Checking number of items in cart on screen', async () => {
  await page.$$eval('product-item', items => {
    items.forEach(item => {
      const btn = item.shadowRoot.querySelector('button');
      if (btn && btn.innerText === 'Add to Cart') btn.click();
    });
  });

  await page.waitForFunction(
    () => document.querySelector('#cart-count').innerText === '20'
  );

  const cartCount = await page.$eval('#cart-count', el => el.innerText);
  expect(cartCount).toBe('20');
}, 10000);

it('Checking number of items in cart on screen after reload', async () => {
  await page.reload({ waitUntil: 'networkidle0' });

  const wrongLabel = await page.$$eval('product-item', items =>
    items.find(item =>
      item.shadowRoot.querySelector('button').innerText !== 'Remove from Cart'
    )
  );
  expect(wrongLabel).toBeUndefined();

  const cartCount = await page.$eval('#cart-count', el => el.innerText);
  expect(cartCount).toBe('20');
}, 10000);

it('Checking the localStorage to make sure cart is correct', async () => {
  const cart = await page.evaluate(() => localStorage.getItem('cart'));
  expect(cart).toBe(
    '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]'
  );
}, 10000);

  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    /**
     **** TODO - STEP 6 **** 
     * Go through and click "Remove from Cart" on every single <product-item>, just like above.
     * Once you have, check to make sure that #cart-count is now 0
     * Remember to remove the .skip from this it once you are finished writing this test.
      */
     await page.$$eval('product-item', items => {
      items.forEach(item => {
        const btn = item.shadowRoot.querySelector('button');
        if (btn && btn.innerText === 'Remove from Cart') btn.click();
      });
    });
  
    // Wait until counter hits 0 (guards against race condition)
    await page.waitForFunction(
      () => document.querySelector('#cart-count').innerText === '0'
    );
  
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');
  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    /**
     **** TODO - STEP 7 **** 
     * Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
       is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
     * Also check to make sure that #cart-count is still 0
     * Remember to remove the .skip from this it once you are finished writing this test.
     */
       await page.reload({ waitUntil: 'networkidle0' });

       // Verify every button now says “Add to Cart”
       const wrongLabel = await page.$$eval('product-item', items =>
         items.find(item =>
           item.shadowRoot.querySelector('button').innerText !== 'Add to Cart'
         )
       );
       expect(wrongLabel).toBeUndefined();
     
       const cartCount = await page.$eval('#cart-count', el => el.innerText);
       expect(cartCount).toBe('0');
     
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
    /**
     **** TODO - STEP 8 **** 
     * At this point he item 'cart' in localStorage should be '[]', check to make sure it is
     * Remember to remove the .skip from this it once you are finished writing this test.
     */

  });
});
