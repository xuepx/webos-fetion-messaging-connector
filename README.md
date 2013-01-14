#webOS Fetion Synergy Messaging connector.

*Fork from ericblade/webOS-messaging-connector*


## 功能

*1.发送飞信消息, 使用对方手机号发送*

*2.接受飞信消息, 接受的消息ID为飞信内部ID(非飞信号,也非手机号)*

*3.给任何好友发送消息@start开启5分钟一次的检查新消息,@stop停止检查新消息*

## BUG

*1.帐号删除未成功.(始终提示没有权限删除, permission似乎未起作用. imloginstate变为更新, 而非put来临时解决此问题)*

*2.发送响应慢, 对方可能受到两条消息.*

*3.长时间未使用,发送消息,第一次可能失败.*