package repository


import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository

@Repository
interface MessageRepository : JpaRepository<Message, Long>