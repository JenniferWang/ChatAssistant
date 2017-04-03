# A chat bot based on [wechat4u](https://github.com/nodeWechat/wechat4u)

**Tips on how to run the code:**
* install `yarn` then run `yarn install`
* install `npm install --global flow-remove-types`
* run `flow-node src/index.js`

**Features:**
* Parse Bilibili and Netease music uri for you -- you could then copy the number in Bilibili app and watch it on your phone!

<img src="https://cloud.githubusercontent.com/assets/7834443/24339740/78ff0372-1262-11e7-8e82-ac3aa7771b3b.png" width=500x>

* Parse hashtag and saves to db for the current chat thread. It supports the following semantics:
 * save: 'some content #foo #bar', or 'some content' then '#foo #bar' in a separate message.
 * search: '^[查|找|搜]+' + 'content that contains one hashtag'.
 * clear: '^[清|删][理|除|空]' + 'content that contains one hashtag'.

<img src="https://cloud.githubusercontent.com/assets/7834443/24592330/290397d6-17c9-11e7-85e4-665e5e32dbd5.png" width=500x>

* Use [Tuling123](http://www.tuling123.com/) as the NLP engine to power other interaction.

<img src="https://cloud.githubusercontent.com/assets/7834443/24339896/725713ce-1263-11e7-8619-4abd1a64316c.png" width=500x>

**Todo:**
* Better DB design
* Performance measurement
