from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from .db import Base

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), nullable=False)
    communication_id = Column(UUID(as_uuid=True), ForeignKey("communications.id"))
    role = Column(String(20), nullable=False)  # 'system', 'assistant', 'user'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    tokens_used = Column(Integer)
    metadata = Column(JSON)

    def to_dict(self):
        return {
            "id": str(self.id),
            "session_id": str(self.session_id),
            "communication_id": str(self.communication_id) if self.communication_id else None,
            "role": self.role,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "tokens_used": self.tokens_used,
            "metadata": self.metadata
        } 