/*
 * These hooks are called by the Aragon Buidler plugin during the start task's lifecycle. Use them to perform custom tasks at certain entry points of the development build process, like deploying a token before a proxy is initialized, etc.
 *
 * Link them to the main buidler config file (buidler.config.js) in the `aragon.hooks` property.
 *
 * All hooks receive two parameters:
 * 1) A params object that may contain other objects that pertain to the particular hook.
 * 2) A "bre" or BuidlerRuntimeEnvironment object that contains enviroment objects like web3, Truffle artifacts, etc.
 *
 * Please see AragonConfigHooks, in the plugin's types for further details on these interfaces.
 * https://github.com/aragon/buidler-aragon/blob/develop/src/types.ts#L31
 */
let erc20, token;

module.exports = {
  // Called before a dao is deployed.
  preDao: async ({ log }, { web3, artifacts }) => {},

  // Called after a dao is deployed.
  postDao: async (
    { dao, _experimentalAppInstaller, log },
    { web3, artifacts }
  ) => {},

  // Called after the app's proxy is created, but before it's initialized.
  preInit: async (
    { proxy, _experimentalAppInstaller, log },
    { web3, artifacts }
  ) => {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const ERC20 = artifacts.require('ERC20Sample');
    const MiniMeToken = artifacts.require('MiniMeToken');
    // const TokenWrapper = artifacts.require('TokenWrapper');
    const accounts = await web3.eth.getAccounts();

    // const dao = await Kernel.new(false)
    // const aclBase = await ACL.new()
    // await dao.initialize(aclBase.address, accounts[0])
    // const acl = ACL.at(await dao.acl())
    // await acl.createPermission(accounts[0], dao.address, await dao.APP_MANAGER_ROLE(), accounts[0], { from: accounts[0] })
    // // log(accounts);
    // const tokenWrapperBase = await TokenWrapper.new()
    // const { logs } = await dao.newAppInstance('0x1234', tokenWrapperBase.address, '0x', false, { from: accounts[0] })
    // tokenWrapper = TokenWrapper.at(logs.find(l => l.event === 'NewAppProxy').args.proxy)
    // const tokenWrapper = await _experimentalAppInstaller("token-wrapper");
    const TokenWrapper = artifacts.require('TokenWrapper');
    const tokenWrapper = await TokenWrapper.at(proxy.address);
    erc20 = await ERC20.new({ from: accounts[0] }) // mints 1M e 18 tokens to sender;
    // log('HMMM ' + JSON.stringify(tokenWrapper));
    log(proxy.address);
    log(tokenWrapper.address);
    log(erc20.address);
    token = await MiniMeToken.new(ZERO_ADDRESS, ZERO_ADDRESS, 0, 'Token', 18, 'TWR', false, { from: accounts[0] });
    log(token.address);
    await token.changeController(proxy.address, { from: accounts[0] })
    log('OK OK OK OK OK OK OK OK OK OK OK');
  },

  // Called after the app's proxy is initialized.
  postInit: async (
    { proxy, _experimentalAppInstaller, log },
    { web3, artifacts }
  ) => {
    log('OK OK OK OK OK OK OK OK OK OK OK');
  },

  // Called when the start task needs to know the app proxy's init parameters.
  // Must return an array with the proxy's init parameters.
  getInitParams: async ({ log }, { web3, artifacts }) => {
    log(JSON.stringify([token.address, erc20.address]))
    return [token.address, erc20.address];
  },

  // Called after the app's proxy is updated with a new implementation.
  postUpdate: async ({ proxy, log }, { web3, artifacts }) => {log('OK OK OK OK OK OK OK OK OK OK OK');},
}
