<!-- websocket -->
<template>
  <div class="content" style="display:none">
    <textarea id="responseText"></textarea>
  </div>
</template>
<script>
import { Notification } from 'element-ui';
export default {
  data () {
    return {
      mpush: {},
      log: {},
      socket: {},
      session: {},
      ID_SEQ: 1,
      config: { listener: null, log: console },
      Command: {
        HANDSHAKE: 2,
        BIND: 5,
        UNBIND: 6,
        ERROR: 10,
        OK: 11,
        KICK: 13,
        PUSH: 15,
        ACK: 23,
        UNKNOWN: -1
      },
      listener: {},

      noticeData: ''
    }
  },

  mounted () {
    this.mpush = {
      connect: this.doConnect,
      close: this.doClose,
      bindUser: this.bindUser
    }

    this.log = {
      log: () => {
        this.$("responseText").value += (Array.prototype.join.call(arguments, "") + "\r\n");
      }
    };
    this.log.debug = this.log.info = this.log.warn = this.log.error = this.log.log;

    this.listener = {
      onOpened: (event) => {
        if (this.config.listener != null) {
          this.config.listener.onOpened(event);
        }
        this.handshake();
      },
      onClosed: (event) => {
        if (this.config.listener != null) {
          this.config.listener.onClosed(event);
        }
        this.session = {};
        this.ID_SEQ = 1;
        this.socket = null;
      },
      onHandshake: () => {
        this.session.handshakeOk = true;
        if (this.config.listener != null) {
          this.config.listener.onHandshake();
        }
        if (this.config.userId) {
          this.bindUser(this.config.userId, this.config.tags);
        }
      },
      onBindUser: (success) => {
        if (this.config.listener != null) {
          this.config.listener.onBindUser(success);
        }
      },
      onReceivePush: (message, messageId) => {
        if (this.config.listener != null) {
          this.config.listener.onReceivePush(message, messageId);
        }
      },
      onKickUser: function (userId, deviceId) {
        if (this.config.listener != null) {
          this.config.listener.onKickUser(userId, deviceId);
        }
        doClose(-1, "kick user");
      }
    };
    this.connect();
  },
  methods: {
    connect () {
      this.connect3();
    },
    submit () {
      return false;
    },
    connect3 () {
      this.mpush.connect({
        url: 'ws://61.167.237.45:8088/',
        userId: this.$store.state.user.userId+"",
        deviceId: "test-1001",
        osName: "web " + navigator.userAgent,
        osVersion: "55.2",
        clientVersion: "1.0",
        log: this.log
      });
    },
    $ (id) {
      return document.getElementById(id);
    },
    bind () {
      this.mpush.bindUser(this.$("userId").value)
    },
    Packet (cmd, body, sessionId) {
      return {
        cmd: cmd,
        flags: 16,
        sessionId: sessionId || this.ID_SEQ++,
        body: body
      }
    },

    handshake () {
      this.send(this.Packet(this.Command.HANDSHAKE, {
        deviceId: this.config.deviceId,
        osName: this.config.osName,
        osVersion: this.config.osVersion,
        clientVersion: this.config.clientVersion
      })
      );
    },

    bindUser (userId, tags) {
      if (userId && userId != this.session.userId) {
        this.session.userId = userId;
        this.session.tags = tags;
        this.send(this.Packet(this.Command.BIND, { userId: userId, tags: tags }));
      }
    },

    ack (sessionId) {
      this.send(this.Packet(this.Command.ACK, null, sessionId));
    },

    send (message) {

      if (!this.socket) {
        return;
      }
      if (this.socket.readyState == WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        this.config.log.error("The socket is not open.");
      }
    },

    dispatch (packet) {
      switch (packet.cmd) {
        case this.Command.HANDSHAKE: {
          this.config.log.debug(">>> handshake ok.");
          this.listener.onHandshake();
          break;
        }
        case this.Command.OK: {
          if (packet.body.cmd == this.Command.BIND) {
            this.config.log.debug(">>> bind user ok.");
            this.listener.onBindUser(true);
          }
          break;
        }
      }
    },
    // 接收服务器推送消息
    onReceive (event) {
      this.config.log.debug(">>> receive packet=" + event.data);
      this.noticeData = JSON.parse(event.data)
      this.dispatch(JSON.parse(event.data))
      if(this.noticeData.body && this.noticeData.body.content){
        let msgData = JSON.parse(this.noticeData.body.content)
        this.$store.dispatch("checkMessage");//修改顶部铃铛消息状态
        this.$notify.info({
          title: '消息提醒',
          dangerouslyUseHTMLString: true,
          message: '您有未处理的消息，请进入<span style="cursor:pointer;color:#409EFF">消息中心</span>查看',
          duration: 0,
          onClick:()=>{
            // 跳转消息列表
            this.$router.push('/message/messageList')
            Notification.closeAll()
          }
        });
      }
      
      
      /***
       * type 类型 来源
       * contentId 文件ID
       * title 名称
       * msgId 消息ID
       * createTime 
       */
    },

    onOpen (event) {
      this.config.log.info("Web Socket opened!");
      this.listener.onOpened(event);
    },

    onClose (event) {
      this.config.log.info("Web Socket closed!");
      this.listener.onClosed(event);
    },

    onError (event) {
      this.config.log.info("Web Socket receive, error");
      this.doClose();
    },

    doClose (code, reason) {
      if (this.socket) this.socket.close();
      this.config.log.info("try close web socket client, reason=" + reason);
    },

    doConnect (cfg) {
      this.config = this.copy(cfg);
      this.socket = new WebSocket(this.config.url);
      this.socket.onmessage = this.onReceive;
      this.socket.onopen = this.onOpen;
      this.socket.onclose = this.onClose;
      this.socket.onerror = this.onError;
      this.config.log.debug("try connect to web socket server, url=" + this.config.url);
    },
    copy (cfg) {
      for (let p in cfg) {
        if (cfg.hasOwnProperty(p)) {
          this.config[p] = cfg[p];
        }
      }
      return this.config;
    },
  }
};
</script>
<style scoped>
</style>