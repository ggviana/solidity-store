/* global artifacts, beforeEach, contract, it */

const { expect, use } = require('chai')
const BN = require('bn.js')

use(require('chai-bn')(BN))

const Store = artifacts.require('Store')

const user0 = '0x789ffC0F4dCfff50Af4ff03151C6D221BbA0f111000000000000000000000000'.toLowerCase()
const user1 = '0x12b3FB7A671d9Bf1325e60264d47Da1B32Fa5D93000000000000000000000000'.toLowerCase()

const maxValue = new BN(1).pow(new BN(256)).sub(new BN(1))

contract('Store', ([_, creator]) => {
  let store

  beforeEach(async () => {
    store = await Store.new({ from: creator })
  })

  it('stores values correctly', async () => {
    let result

    await store.set(user0, new BN(20))

    result = await store.get(user0)
    expect(result.found).to.be.true
    expect(result.value).to.be.a.bignumber.equal(new BN(20))

    await store.set(user1, maxValue)

    result = await store.get(user1)
    expect(result.found).to.be.true
    expect(result.value).to.be.a.bignumber.equal(maxValue)
  })

  it('removes values correctly', async () => {
    let result

    await store.set(user0, new BN(20))

    result = await store.get(user0)
    expect(result.value).to.be.a.bignumber.equal(new BN(20))

    await store.remove(user0)
    result = await store.get(user0)

    expect(result.found).to.be.false
    expect(result.value).to.be.a.bignumber.equal(new BN(0))
    expect(await store.has(user0)).to.be.false
  })

  it('fails to find a non existing key', async () => {
    let result

    await store.set(user0, new BN(20))

    result = await store.get(user1)
    expect(result.found).to.be.false
    expect(result.value).to.be.a.bignumber.equal(new BN(0))
  })

  it('retrieves a value at a given index', async () => {
    let result

    await store.set(user0, new BN(20))
    await store.set(user1, new BN(40))

    result = await store.getAt(0)
    expect(result.found).to.be.true
    expect(result.value).to.be.a.bignumber.equal(new BN(20))

    result = await store.getAt(1)
    expect(result.found).to.be.true
    expect(result.value).to.be.a.bignumber.equal(new BN(40))
  })

  it('informs the stored keys', async () => {
    expect(await store.keys()).to.be.an('array').that.is.empty

    await store.set(user0, new BN(20))
    await store.set(user1, new BN(20))

    expect(await store.keys()).to.be.an('array').that.have.ordered.members([user0, user1])
  })

  it('informs the stored key at a given index', async () => {
    await store.set(user0, new BN(20))
    await store.set(user1, new BN(20))

    expect(await store.keyAt(0)).to.equal(user0)
    expect(await store.keyAt(1)).to.equal(user1)
  })

  it('checks if the Set has a stored key', async () => {
    expect(await store.has(user0)).to.be.false

    await store.set(user0, new BN(20))

    expect(await store.has(user0)).to.be.true
  })

  it('informs the current size', async () => {
    let size

    size = await store.size()
    expect(size).to.be.a.bignumber.equal(new BN(0))

    await store.set(user0, 90)

    size = await store.size()
    expect(size).to.be.a.bignumber.equal(new BN(1))

    await store.remove(user0)

    size = await store.size()
    expect(size).to.be.a.bignumber.equal(new BN(0))
  })

  it('informs whether the Set is empty', async () => {
    expect(await store.isEmpty()).to.be.true

    await store.set(user0, new BN(20))
    expect(await store.isEmpty()).to.be.false

    await store.remove(user0)
    expect(await store.isEmpty()).to.be.true
  })

  it('empties the Set correctly', async () => {
    expect(await store.isEmpty()).to.be.true

    await store.set(user0, new BN(20))
    await store.set(user1, new BN(20))
    expect(await store.isEmpty()).to.be.false

    await store.empty()
    expect(await store.isEmpty()).to.be.true
  })
})
