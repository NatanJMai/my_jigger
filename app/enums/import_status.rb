class ImportStatus < ClassyEnum::Base
end

class ImportStatus::InProgress < ImportStatus
end

class ImportStatus::Error < ImportStatus
end

class ImportStatus::Completed < ImportStatus
end
