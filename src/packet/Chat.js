var DynamicBuffer = require('./DynamicBuffer');

function Chat(flags, rgb, name, msg) {
    this.flags = flags;
    this.rgb = rgb;
    this.name = name;
    this.msg = msg;
}

module.exports = Chat;

Chat.prototype.build = function() {
    let buf = new DynamicBuffer(true);

    buf.setUint8(99);
    buf.setUint8(this.flags);
    buf.setUint8(this.rgb.r);
    buf.setUint8(this.rgb.g);
    buf.setUint8(this.rgb.b);
    buf.setStringUTF8(this.name);
    buf.setUint8(0);
    buf.setStringUTF8(this.msg);
    buf.setUint8(0);

    return buf.build();
}
