const assert = require('assert');
const Web3 = require('web3');
const ganache = require('ganache');
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // Use one of those accounts to deploy the contract
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data: compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: 10000000});

    await factory.methods.createCampaigns('100').send({
        from: accounts[0],
        gas: 10000000
    });
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    )
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(accounts[0], manager);
    });
    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });
    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '99',
                from: accounts[1]
            });
        } catch (err) {
            assert(err)
        }
    });
    it('allows a manager to create a payment request', async () => {
        const description = 'Buy batteries'
        await campaign.methods
            .createRequest(description, '100', accounts[1])
            .send({
                from: accounts[0],
                gas: 1000000
            });
        const request = await campaign.methods.requests(0).call();

        assert.strictEqual(description, request.description);
    });
    it('processes request', async () => {
        const getBalance = async account => parseFloat(
            web3.utils.fromWei(
                await web3.eth.getBalance(account),
                'ether'
            )
        );
        const initialBalance = await getBalance(accounts[1]);
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: Web3.utils.toWei('10', 'ether')
        });
        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({from: accounts[0], gas: 1000000});
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: 1000000
        });
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: 1000000
        });
        const balance = await getBalance(accounts[1]);
        assert(balance > initialBalance);
    });
})
