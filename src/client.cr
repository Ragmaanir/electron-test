require "json"
require "socket"

struct Message
  JSON.mapping(
    type: String,
    data: {type: JSON::Any, nilable: true}
  )

  getter type : String
  getter data : JSON::Any?

  def initialize(@type, @data = nil)
  end

  # def to_json
  #   #{type: type, data: data}.to_json
  #   JSON.build do |b|
  #     b.field "type", type
  #     b.
  #   end
  # end
end

server = Socket::UNIXAddress.new("/tmp/app.world")
s = Socket.unix(blocking: true)

send_message = ->(msg : Message) {
  puts "SENDING: #{msg.to_json}"
  s.send(msg.to_json + "\f")
}

channel = Channel(Message).new

spawn do
  begin
    s.connect(server)

    loop do
      puts "Receiving from socket"
      msg, add = s.receive
      msg = msg.split("\f").first
      msg = Message.from_json(msg)
      channel.send(msg)
    end
  rescue e
    p e
    raise e
  end
end

spawn do
  begin
    loop do
      puts "Reading from channel"

      msg = channel.receive

      puts "RECEIVED: #{msg.to_json}"

      case msg.type
      when "ready"
        send_message.call(Message.new("screenshot"))
      when "screenshot.done"
        send_message.call(Message.new("quit"))
        s.close
        puts "Exiting"
        exit
      end
    end
  rescue e
    p e
    raise e
  end
end

Fiber.yield

# p s.receive(100)
# msg = %{{"type": "screenshot", "data": {}}\f}
# p msg
# s.send(msg)
# p s.receive(100)

# msg = %{{"type": "quit", "data": {}}\f}
# p msg
# s.send(msg)
