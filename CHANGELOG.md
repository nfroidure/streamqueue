<a name="1.1.2"></a>
## [1.1.2](https://github.com/nfroidure/StreamQueue/compare/v1.1.1...v1.1.2) (2017-12-03)


### build

* **metapak-nfroidure:** Add metapak-nfroidure ([a8a9572](https://github.com/nfroidure/StreamQueue/commit/a8a9572))


### BREAKING CHANGES

* **metapak-nfroidure:** Remove support for Node version prior to the last LTS



### v1.1.1 (2015/08/27 11:33 +00:00)
- [a772c39](https://github.com/nfroidure/streamqueue/commit/a772c3925e60fd2f26b7a2f8e0aa500793df62bc) 1.1.1 (@nfroidure)
- [a2443fd](https://github.com/nfroidure/streamqueue/commit/a2443fdd28ccab84892f08f3d55a7c8b304e4fb3) Fixing the .obj() shortcut with no args fix #9 (@nfroidure)

### v1.1.0 (2015/06/09 06:19 +00:00)
- [f8f8fc3](https://github.com/nfroidure/streamqueue/commit/f8f8fc35346ec7009021bfe51c89d03bc89dfb9b) 1.1.0 (@nfroidure)
- [403331d](https://github.com/nfroidure/streamqueue/commit/403331d30d2a2be5599add4b94bd5fe84a73c512) Adding a .obj method (@nfroidure)

### v1.0.0 (2015/06/08 16:41 +00:00)
- [1d1399e](https://github.com/nfroidure/streamqueue/commit/1d1399ee9bbd25d3d53d1eca74f40aea124e3d9e) 1.0.0 (@nfroidure)
- [acf36b7](https://github.com/nfroidure/streamqueue/commit/acf36b7ed70192805bf1b2377c982918e7785f90) Updating dependencies (@nfroidure)
- [7473d22](https://github.com/nfroidure/streamqueue/commit/7473d223388a26597c3bf48ca64b3b976bb96b95) Fixing hints (@nfroidure)
- [cc0b79b](https://github.com/nfroidure/streamqueue/commit/cc0b79b5e4f70dc6dfe0ffa66d7992d68292c2d0) Fix travis build (@nfroidure)

### v0.1.3 (2015/02/14 14:40 +00:00)
- [b54a812](https://github.com/nfroidure/streamqueue/commit/b54a8121c93bcb2283dd586b1f46f9f4e14aa5c2) 0.1.3 (@nfroidure)
- [a0acd1b](https://github.com/nfroidure/streamqueue/commit/a0acd1b8112f53f7cc05a87c677e4e724ad7a906) 0.1.2 (@nfroidure)

### v0.1.2 (2015/02/14 14:36 +00:00)
- [af60e80](https://github.com/nfroidure/streamqueue/commit/af60e80b2b59a5d82239221d5aba53d66668dd27) Removing uneccessary deps (@nfroidure)
- [b43bcd0](https://github.com/nfroidure/streamqueue/commit/b43bcd032bd09ebc4154344858c5bc4d65f74788) Using streamtest for tests (@nfroidure)
- [ca0e386](https://github.com/nfroidure/streamqueue/commit/ca0e386db013c373e2a8909a48dc0a8dace7d97f) Inherit of Readable instead of PassThrough (@nfroidure)
- [47ec014](https://github.com/nfroidure/streamqueue/commit/47ec01474cd3819c08ccbbc08dd44f192c282ac4) Reverting setImmadiate for node 0.8 (@nfroidure)
- [9b6be4a](https://github.com/nfroidure/streamqueue/commit/9b6be4a09da248db385ef12906ccdfd34240d35a) Isolation state prop in a single object (@nfroidure)
- [962ec36](https://github.com/nfroidure/streamqueue/commit/962ec36e6ac22aa919cbe612fdc238f9ab42e3e6) Increasing the streamqueue version (@nfroidure)
- [9bde919](https://github.com/nfroidure/streamqueue/commit/9bde9196911cef9a6222d3b35bdd72269d1d0c20) Fixing the regression closes #5 (@nfroidure)
- [00f5d8c](https://github.com/nfroidure/streamqueue/commit/00f5d8ca458830100a78726e38ab3a19d3a65a04) Replacing setTimmediate per setTimeout in tests to match Node 0.8 (@nfroidure)
- [5e1d91d](https://github.com/nfroidure/streamqueue/commit/5e1d91db0ad4c28e0ce436970a82915ec582c89e) Trying to change the ^ per ~ to fix the Node 0.8 build (@nfroidure)
- [cc7858b](https://github.com/nfroidure/streamqueue/commit/cc7858b3ffcca8c51f1e54c7bcdcb0daa8a88034) Remove legacy streams wrappers since using readable-stream (@nfroidure)
- [9aac64e](https://github.com/nfroidure/streamqueue/commit/9aac64ea2752b482ac731a5535ebd6523a3b4a61) Conflicts: 	src/index.js (@nfroidure)
- [e85916e](https://github.com/nfroidure/streamqueue/commit/e85916e82deaf43d9d38b75e790d0bf4d99b3d97) Remove require of platform streams (@nfroidure)
- [82b81fe](https://github.com/nfroidure/streamqueue/commit/82b81fedb0cda1c6a038c227adfabc93a8b8fcfc) Using isstream instead of custom function isaacs/readable-stream#87 (@nfroidure)
- [9e92377](https://github.com/nfroidure/streamqueue/commit/9e923770c10a18a5c5f3831a81750d633b5c0b04) Updating dependencies (@nfroidure)
- [a2324c8](https://github.com/nfroidure/streamqueue/commit/a2324c88fd91c8ccaabe3bf5ec7b9d298ee5a9ea) Fireing end asynchronously for consistencies with node streams  #4 (@nfroidure)
- [bb27bb8](https://github.com/nfroidure/streamqueue/commit/bb27bb8bc0b303dd311889912da99a82889e7223) Testing streamqueues inside streamqueues #4 (@nfroidure)
- [92106fc](https://github.com/nfroidure/streamqueue/commit/92106fc4758e232560a0bf12694210e6e3c2c545) Execute end instead of firing the event (@nfroidure)
- [1f1a917](https://github.com/nfroidure/streamqueue/commit/1f1a9174d466ea50499a4909f3cacbc0fea95ee4) Making .done() fire "end" asynchronously (@fidian)
- [40bfb72](https://github.com/nfroidure/streamqueue/commit/40bfb72ca98845551cb928c2fb471a9141d90935) Version update (@nfroidure)
- [21e2eee](https://github.com/nfroidure/streamqueue/commit/21e2eee2a6adc621b7659283c2db707fabac8029) iImproving performances by unpiping previously piped stream (@nfroidure)
- [0a13b08](https://github.com/nfroidure/streamqueue/commit/0a13b08a8dd08f9934b1062eacc60526ab981d4c) Fixing the README file (@nfroidure)
- [18b2347](https://github.com/nfroidure/streamqueue/commit/18b23470c78d5b9f74d82cd5b19f4105af9b69d2) New version 0.0.6 (@nfroidure)
- [f75dc68](https://github.com/nfroidure/streamqueue/commit/f75dc6879204e4cc344fdeba6229d4e037324e2c) Added badges (@nfroidure)
- [421923a](https://github.com/nfroidure/streamqueue/commit/421923aba4e61221676fb46150fc0502bd11f017) Dependencies update (@nfroidure)
- [c79479a](https://github.com/nfroidure/streamqueue/commit/c79479a534e9e408a8c4264eb022510920e34ca8) Depending on readable stream closes #3 (@nfroidure)
- [46b3e5f](https://github.com/nfroidure/streamqueue/commit/46b3e5f11d3152a8f18bfff599fa75c1bf99d41e) Accepting fucntion returning streams (@nfroidure)
- [a355962](https://github.com/nfroidure/streamqueue/commit/a355962a5c70381c6ab1fcbaf978f687956f7e52) Ginving up 0.11. Waiting 0.12 (@nfroidure)
- [29a15f2](https://github.com/nfroidure/streamqueue/commit/29a15f24f278128246db87732313e6de7cb8202a) Fix attempt for node 0.11 (@nfroidure)
- [973c094](https://github.com/nfroidure/streamqueue/commit/973c094bbdf5110cdc17278d63ed5fb4e4da513a) Improved code coverage (@nfroidure)
- [c3b0116](https://github.com/nfroidure/streamqueue/commit/c3b01164fbab579614f0ca455ee4addebf8280b6) Added coverage tests (@nfroidure)
- [ecfdcc4](https://github.com/nfroidure/streamqueue/commit/ecfdcc4c8f2daf68bacb25035560eb7133c7e1b5) New verion 0.0.4 (@nfroidure)
- [8d4a0f6](https://github.com/nfroidure/streamqueue/commit/8d4a0f6805cbd5c986127631bad05b796c84b572) Fix for objectMode old streams (@nfroidure)
- [88f2e13](https://github.com/nfroidure/streamqueue/commit/88f2e13597c69f373b2f3d41737b7dbf4e5eeacd) Wrap old streams automatically (@nfroidure)
- [b58e827](https://github.com/nfroidure/streamqueue/commit/b58e8275d2249179e58beb5544a523e804b17675) Deprecating pause option, pausing/resuming flowing mode streams automtically (@nfroidure)
- [a5a7241](https://github.com/nfroidure/streamqueue/commit/a5a724160859486c93353e05995cbb9c1235f7a6) Added support for flowing mode, pause not aware streams (@nfroidure)
- [0d71911](https://github.com/nfroidure/streamqueue/commit/0d71911526ac77988b5d4adfd8fa37f065fe83d4) Going to 0.0.2 (@nfroidure)
- [d7adcdd](https://github.com/nfroidure/streamqueue/commit/d7adcdd8462af6555216c6da157027cc472098c6) Merging master (@nfroidure)
- [86bd513](https://github.com/nfroidure/streamqueue/commit/86bd513b0b86074474f4f0c4e2983ae422b6b65d) Adding functionnal API + pause option (@nfroidure)
- [#2](https://github.com/nfroidure/streamqueue/pull/2) Make new keyword optional (@darsain)
- [9d18b32](https://github.com/nfroidure/streamqueue/commit/9d18b32ee86c4467f8ca070689f6204c2ab11f69) Make new keyword optional (@darsain)
- [4b0f385](https://github.com/nfroidure/streamqueue/commit/4b0f3855e8f0768edd9ed247255224a01310a562) Fix the NPM module link (@nfroidure)
- [e5a4ecd](https://github.com/nfroidure/streamqueue/commit/e5a4ecd105d727c4e23be3a45b3bf5fce75c96dc) Reemitting errors (@nfroidure)
- [91c874e](https://github.com/nfroidure/streamqueue/commit/91c874e92d6e55842e19e4898641097856f49e54) Replacing end by done (@nfroidure)
- [b578cf2](https://github.com/nfroidure/streamqueue/commit/b578cf26ea4b842e8f93bbc856079452a9405297) Improved the readme + added the cli tests command (@nfroidure)
- [3b4d9cd](https://github.com/nfroidure/streamqueue/commit/3b4d9cd21916c1a4285e8ff51147b2556c68738d) First commit (@nfroidure)
