class StagingStatus < ClassyEnum::Base
end

class StagingStatus::InProgress < StagingStatus
end

class StagingStatus::AwaitingUser < StagingStatus
end

class StagingStatus::Error < StagingStatus
end

class StagingStatus::Completed < StagingStatus
end