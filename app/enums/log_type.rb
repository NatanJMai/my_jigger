class LogType < ClassyEnum::Base
end

class LogType::Info < LogType
end

class LogType::Debug < LogType
end

class LogType::Success < LogType
end

class LogType::Warning < LogType
end

class LogType::Error < LogType
end
