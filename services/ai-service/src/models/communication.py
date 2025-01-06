from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from .db import Base

class Communication(Base):
    __tablename__ = "communications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"))
    type = Column(String(20), nullable=False)  # 'sms', 'call', 'email'
    direction = Column(String(10), nullable=False)  # 'inbound', 'outbound'
    status = Column(String(20), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    metadata = Column(JSON)

    def to_dict(self):
        return {
            "id": str(self.id),
            "job_id": str(self.job_id) if self.job_id else None,
            "type": self.type,
            "direction": self.direction,
            "status": self.status,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "metadata": self.metadata
        } 